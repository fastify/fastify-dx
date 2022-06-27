<sub>**Go back to the [index](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/README.md).**</sub>

<br>

## Virtual Modules

**Fastify DX** relies on [virtual modules](https://github.com/rollup/plugins/tree/master/packages/virtual) to save your project from having too many boilerplate files. Virtual modules are a [Rollup](https://rollupjs.org/guide/en/) feature exposed and fully supported by [Vite](https://vitejs.dev/). When you see imports that start with `/dx:`, you know a Fastify DX virtual module is being used.

Fastify DX virtual modules are **fully ejectable**. For instance, the starter template relies on the `/dx:root.jsx` virtual module to provide the Vue shell of your application. If you copy the `root.jsx` file [from the fastify-dx-solid package](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/virtual/root.jsx) and place it your Vite project root, **that copy of the file is used instead**. In fact, the starter template already comes with a custom `root.jsx` of its own to include UnoCSS.

Aside from `root.jsx`, the starter template comes with two other virtual modules already ejected and part of the local project — `context.js` and `layouts/default.jsx`. If you don't need to customize them, you can safely removed them from your project.

### `/dx:root.jsx`

This is the root Solid component. It's provided as part of the starter template. You can use this file to add a common layout to all routes. The version provided as part of the starter template includes [UnoCSS](https://github.com/unocss/unocss)'s own virtual module import, necessary to enable its CSS engine.

```jsx
import 'uno.css'
import { createMutable } from 'solid-js/store'
import { Router, Routes, Route } from 'solid-app-router'
import DXRoute from '/dx:route.jsx'

export default function Root (props) {
  props.payload.serverRoute.state = createMutable(props.payload.serverRoute.state)
  return (
    <Router url={props.url}>
      <Routes>{
        // eslint-disable-next-line solid/prefer-for
        props.payload.routes.map(route =>
          <Route path={route.path} element={
            <DXRoute
              state={props.payload.serverRoute.state}
              path={route.path}
              payload={props.payload}
              component={route.component} />
          } />
        )
      }</Routes>
    </Router>
  )
}
```

### `/dx:route.jsx`

This is used by `root.jsx` to enhance your route modules with the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md).

<b>You'll rarely need to customize this file.</b>

```jsx
import { createContext, createSignal, createResource, children } from 'solid-js'
import { isServer, Suspense } from 'solid-js/web'
import { Router, Routes, Route, useLocation } from 'solid-app-router'
import { RouteContext, jsonDataFetch } from '/dx:core.js'
import layouts from '/dx:layouts.js'

export default function DXRoute (props) {
  const ctx = props.payload.routeMap[props.path]
  const location = useLocation()

  ctx.state = props.state
  ctx.actions = props.payload.serverRoute.actions  

  if (isServer) {
    ctx.layout = props.payload.serverRoute.layout ?? 'default'
    ctx.data = props.payload.serverRoute.data
  }

  async function setup () {
    if (props.payload.serverRoute.firstRender) {
      // ctx.hydration = props.payload.serverRoute.hydration
      ctx.data = props.payload.serverRoute.data
      ctx.layout = props.payload.serverRoute.layout ?? 'default'
      props.payload.serverRoute.firstRender = false
      return ctx
    }
    ctx.layout = ctx.layout ?? 'default'
    const { getMeta, getData, onEnter } = await ctx.loader()
    if (getData) {
      try {
        const fullPath = `${location.pathname}${location.search}`
        const updatedData = await jsonDataFetch(fullPath)
        if (!ctx.data) {
          ctx.data = {}
        }
        if (updatedData) {
          Object.assign(ctx.data, updatedData)
        }
        ctx.error = null
      } catch (error) {
        ctx.error = error
      }
    }
    if (getMeta) {
      const updatedMeta = await getMeta(ctx)
      if (updatedMeta) {
        props.payload.head.update(updatedMeta)
      }
    }
    if (onEnter) {
      const updatedData = await onEnter(ctx)
      if (updatedData) {
        Object.assign(ctx.data, updatedData)
      }
    }
    return ctx
  }

  let element
  if (isServer) {
    element = (
      <RouteContext.Provider value={ctx}>
        <Layout id={ctx.layout}>
          <props.component />
        </Layout>
      </RouteContext.Provider>
    )
  } else {
    const [routeContext] = createResource(setup)
    element = (
      <Suspense>
        {!routeContext.loading && 
          <RouteContext.Provider value={routeContext()}>
            <Layout id={routeContext().layout}>
              <props.component />
            </Layout>
          </RouteContext.Provider>
        }
      </Suspense>
    )
  }
  return element
}

function Layout (props) {
  const Component = layouts[props.id].default
  return <Component>{props.children}</Component>
}
```

What you see above is its [full definition](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/virtual/route.jsx).


### `/dx:routes.js`

Fastify DX has **code-splitting** out of the box. It does that by eagerly loading all route data on the server, and then hydrating any missing metadata on the client. That's why the routes module default export is conditioned to `import.meta.env.SSR`, and different helper functions are called for each rendering environment.

```js
export default import.meta.env.SSR
  ? createRoutes(import.meta.globEager('$globPattern'))
  : hydrateRoutes(import.meta.glob('$globPattern'))
```

See [the full file](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/virtual/routes.js) for the `createRoutes()` and `hydrateRoutes()` definitions. 

If you want to use your own custom routes list, you must eject this file as-is and replace the glob imports with your own routes list:

```js
const routes = [
  { 
    path: '/', 
    component: () => import('/custom/index.jsx'),
  }
]

export default import.meta.env.SSR
  ? createRoutes(routes)
  : hydrateRoutes(routes)
````

**Nested routes aren't supported yet.**


### `/dx:core.js`

Implements `useRouteContext()`.

See its full definition [here](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/virtual/core.js).

### `/dx:layouts.js`

This is responsible for loading **layout components**. It's part of `route.jsx` by default. If a project has no `layouts/default.jsx` file, the default one from Fastify DX is used. This virtual module works in conjunction with the `/dx:layouts/` virtual module which provides exports from the `/layouts` folder.

<b>You'll rarely need to customize this file.</b>

```js
import DefaultLayout from '/dx:layouts/default.jsx'

const appLayouts = import.meta.globEager('/layouts/*.jsx')

appLayouts['/layouts/default.jsx'] ??= DefaultLayout

export default Object.fromEntries(
  Object.keys(appLayouts).map((path) => {
    const name = path.slice(9, -4)
    return [name, appLayouts[path]]
  }),
)

```

What you see above is its [full definition](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/virtual/layouts.js).

### `/dx:mount.js`

This is the file `index.html` links to by default. It sets up the application with an `unihead` instance for head management, the initial route context, and provides the conditional mounting logic to defer to CSR-only if `clientOnly` is enabled.

<b>You'll rarely need to customize this file.</b>

[See the full file](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/virtual/mount.js) for the `mount()` function definition.
