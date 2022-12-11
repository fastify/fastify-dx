<br>

# @fastify/solid [![NPM version](https://img.shields.io/npm/v/@fastify/solid.svg?style=flat)](https://www.npmjs.com/package/@fastify/solid) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

**Fastify DX for Solid** (**`@fastify/solid`**) is a renderer for [**@fastify/vite**](https://github.com/fastify/fastify-vite).

It lets you run and SSR (server-side render) **Solid applications built with Vite** on [Fastify](https://fastify.io/), with a minimal and transparent **server-first approach** — everything starts with `server.js`, your actual Fastify server. 

It has an extremely small core (~1k LOC total) and is built on top of [Fastify](https://github.com/fastify/fastify), [Vite](https://vitejs.dev/) and [Solid Router](https://github.com/solidjs/solid-router).

## Quick Start

Ensure you have **Node v16+**.

Make a copy of [**starters/solid**](https://github.com/fastify/fastify-dx/tree/dev/starters/solid). If you have [`degit`](https://github.com/Rich-Harris/degit), run the following from a new directory:

```bash
degit fastify/fastify-dx/starters/solid
```

> **If you're starting a project from scratch**, you'll need these packages installed.
>
> ```bash
> npm i fastify fastify-vite fastify-dx-solid -P
> npm i vite-plugin-solid -D
> ```


Run `npm install`. 
  
Run `npm run dev`. 

Visit `http://localhost:3000/`.

## What's Included

That will get you a **starter template** with:
  
- A minimal [Fastify](https://github.com/fastify/fastify) server.
- Some dummy API routes.
- A `pages/` folder with some [demo routes](https://github.com/fastify/fastify-dx/tree/dev/starters/solid/client/pages).
- All configuration files.

It also includes some _**opinionated**_ essentials:

- [**PostCSS Preset Env**](https://www.npmjs.com/package/postcss-preset-env) by [**Jonathan Neal**](https://github.com/jonathantneal), which enables [several modern CSS features](https://preset-env.cssdb.org/), such as [**CSS Nesting**](https://www.w3.org/TR/css-nesting-1/).

- [**UnoCSS**](https://github.com/unocss/unocss) by [**Anthony Fu**](https://antfu.me/), which supports all [Tailwind utilities](https://uno.antfu.me/) and many other goodies through its [default preset](https://github.com/unocss/unocss/tree/main/packages/preset-uno). 

## Package Scripts

- `npm run dev` boots the development server.
- `npm run build` creates the production bundle.
- `npm run serve` serves the production bundle.

## Basic setup

The [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/solid) follows [fastify-vite](https://github.com/fastify/fastify-vite)'s convention of having a `client` folder with an `index.js` file, which is automatically resolved as your `clientModule` setting.

If you want flat directory setup, where server and client files are mixed together, you can manually set `clientModule` to something else. Note that in this case you'll also need to update `root` in your `vite.config.js` file.

When deploying to production, bear in mind the `client/dist` directory, generated when you run `npm run build`, needs to be included. You'll also want to enable Fastify's [built-in logging](https://www.fastify.io/docs/latest/Reference/Logging/):

```js
const server = Fastify({ logger: true })
```

The starter template's `server.js` file:

```js
import Fastify from 'fastify'
import FastifyVite from 'fastify-vite'
import FastifyDXSolid from 'fastify-dx-solid'

const server = Fastify()

await server.register(FastifyVite, { 
  root: import.meta.url, 
  renderer: FastifyDXSolid,
})

await server.vite.ready()
await server.listen(3000)
```

The starter template's [`vite.config.js`](https://github.com/fastify/fastify-dx/blob/main/starters/solid/vite.config.js) file:

```js
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import viteSolid from 'vite-plugin-solid'
import viteSolidFastifyDX from 'fastify-dx-solid/plugin'
import unocss from 'unocss/vite'

const path = fileURLToPath(import.meta.url)
const root = join(dirname(path), 'client')

const plugins = [
  viteSolid({ ssr: true }),
  viteSolidFastifyDX(),
  unocss()
]

const ssr = {
  noExternal: ['solid-app-router'],
}

export default { root, plugins, ssr }
```

Note that you only need to use Fastify DX's Vite plugin, which includes all functionality from [fastify-vite](https://github.com/fastify/fastify-vite)'s Vite plugin.

</td>
</tr>
</table>

## Project Structure

The [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/solid) looks like this:

```
├── server.js
├── client/
│    ├── index.js
│    ├── context.js
│    ├── root.jsx
│    ├── index.html
│    ├── layouts/
│    │    ├── default.jsx
│    │    └── auth.jsx
│    └── pages/
│          ├── index.jsx
│          ├── client-only.jsx
│          ├── server-only.jsx
│          ├── using-data.jsx
│          └── using-store.jsx
├── vite.config.js
└── package.json
```
  
Several internal files are provided as virtual modules by Fastify DX. They are located inside the `fastify-dx-solid` package in `node_modules`, and dynamically loaded so you don't have to worry about them unless you want them overriden. 

In this case, placing a file with the same name as the registered virtual module in your Vite project root will override it. Find the detailed rundown of all virtual modules [here][virtual-modules].

[virtual-modules]: https://github.com/fastify/fastify-dx/blob/main/docs/solid/virtual-modules.md

The `server.js` file is your application entry point. It's the file that runs everything. It boots a Fastify server configured with [**fastify-vite**](https://github.com/fastify/fastify-vite) and **Fastify DX for Solid** as a renderer adapter to **fastify-vite**. 

The `client/index.js` file is your Vite server entry point, it's the file that provides your client bundle (which runs in the Vite-enriched environment) to the Node.js environment where Fastify runs. 

> Right now, it's mostly a **boilerplate file** because it must exist but it will also probably never need to be changed.

It exports your application's factory function (must be named `create`), the application routes (must be named `routes`) and the universal route context [initialization module](https://github.com/fastify/fastify-dx/blob/main/docs/solid/route-context.md#initialization-module) (must be named `context` and have a dynamic module import so Fastify DX can pick up `default` and named exports).

The `client/index.html` file is the [root HTML template of the application](https://vitejs.dev/guide/#index-html-and-project-root), which Vite uses as the client bundling entry point. 

> You can expand this file with additional `<meta>` and `<link>` tags if you wish, provided you don't remove any of the placeholders. 

This files links to `/dx:mount.js`, which is a virtual module provided by Fastify DX. 

Virtual modules are covered [here][virtual-modules].
  
The `client/pages/` directory contains your route modules, whose paths are dynamically inferred from the directory structure itself. You can change this behavior easily. More on this [here][routing-config].

[routing-config]: https://github.com/fastify/fastify-dx/blob/main/docs/solid/routing-config.md

The `client/layouts/` directory contains your route layout modules, which can be associated to any route. By default, `layouts/default.jsx` is used, but if you don't need to do any modifications on that file, you can safely removed as it's provided by Fastify DX in that case. The starter template also comes with `layouts/auth.jsx`, to demonstrate a more advanced use of layouts.

[routing-config]: https://github.com/fastify/fastify-dx/blob/main/docs/solid/routing-config.md

The `client/context.js` file is the universal [route context][route-context] initialization module. Any named exports from this file are attached to the `RouteContext` class prototype on the server, preventing them from being reassigned on every request. The `default` export from this file, however, runs for every request so you can attach any request-specific data to it.

[route-context]: https://github.com/fastify/fastify-dx/blob/main/docs/solid/route-context.md

# Rendering modes

Following the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md), Fastify DX's route modules can be set for universal rendering (SSR + CSR hydration, the default behavior), SSR in streaming mode, SSR only (client gets no JavaScript) or CSR only (SSR fully disabled). Fastify DX for Svelte supports all of these modes minus streaming, which is currently not yet supported by Svelte itself.

## `streaming`

If a route module exports `streaming` set to `true`, SSR will take place in **streaming mode**. That means if you have components depending on asynchronous resources and `<Suspense>` sections with defined fallback components, they will be streamed right way while the resources finish processing.

```jsx
import { createResource } from 'solid-js'
import { useRouteContext } from '/dx:core.js'

export const streaming = true

export default function Streaming () {
  const {state} = useRouteContext()
  const [message] = createResource(async () => {
    // If already retrieved on the server, no need
    // to wait for it on the client
    if (state.message) {
      return state.message
    }
    // Note: assignments to useRouteContext().state on the server
    // are automatically relayed to the client in the hydration payload
    const message = await afterSeconds({
      message: 'Delayed by Resource API',
      seconds: 5,
    })
    state.message = message
    return message
  })
  return (
    <Suspense fallback={<p>Waiting for content</p>}>
      <Message message={message()} />
    </Suspense>
  )
}
```

[See the full example](https://github.com/fastify/fastify-dx/blob/main/starters/solid/client/pages/streaming.jsx) in the [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/solid).

## `serverOnly`

If a route module exports `serverOnly` set to `true`, only SSR will take place. The client gets the server-side rendered markup without any accompanying JavaScript or data hydration.

You should use this setting to deliver lighter pages when there's no need to run any code on them, such as statically generated content sites.

```jsx
export const serverOnly = true

export default function ServerOnly (props) {
  return <p>This route is rendered on the server only!</p>
}
```

[This example](https://github.com/fastify/fastify-dx/blob/main/starters/solid/client/pages/server-only.jsx) is part of the [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/solid).

## `clientOnly`

If a route module exports `clientOnly` set to `true`, no SSR will take place, only data fetching and data hydration. The client gets the empty container element (the one that wraps `<!-- element -->` in `index.html`) and all rendering takes place on the client only.

You can use this setting to save server resources on internal pages where SSR makes no significant diference for search engines or UX in general, such as a password-protected admin section.

```jsx
export const clientOnly = true

export default function Route (props) {
  return <p>This route is rendered on the client only!</p>
}
```

[This example](https://github.com/fastify/fastify-dx/blob/main/starters/solid/client/pages/client-only.jsx) is part of the [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/solid).

## Routing Configuration

By default, routes are loaded from the `<project-root>/pages` folder, where `<project-root>` refers to the `root` setting in `vite.config.js`. The route paths are **dynamically inferred from the directory structure**, very much like Next.js and Nuxt.js.

### Dynamic parameters

Dynamic route parameters follow the [Next.js convention](https://nextjs.org/docs/basic-features/pages#pages-with-dynamic-routes) (`[param]`), but that can be overriden by using the `paramPattern` plugin option. For example, this configuration switches the param pattern to the [Remix convention](https://remix.run/docs/en/v1/guides/routing#dynamic-segments) (`$param`).

```js
// ...
const plugins = [
  // ...
  viteSvelteFastifyDX({ paramPattern: /\$(\w+)/ }),
]
```

### Routes location

You can also change the glob pattern used to determine where to route modules from. 

Since this setting is passed to [Vite's glob importers](https://vitejs.dev/guide/features.html#glob-import), the value needs to be a string:

```js
// ...
const plugins = [
  // ...
  viteSvelteFastifyDX({ globPattern: '/views/**/*.svelte' }),
]
```

### View modules

You also can export a `path` constant from your route modules, in which case its value will be used to **override the dynamically inferred paths from the directory structure**. 

Additionally, [**you can provide your own routes**](https://github.com/fastify/fastify-dx/tree/dev/packages/fastify-dx-svelte#dxroutesjs).

```html
<script context="module">
export const path = '/my-page'
</script>

<p>Route with path export</p>
```

## Isomorphic data prefetching

Fastify DX for Svelte implements the `getData()` hook from the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md) to solve this problem.

### `getData(ctx)`

This hook is set up in a way that it runs server-side before any SSR takes place, so any data fetched is made available to the route component before it starts rendering. During first render, any data retrieved on the server is automatically sent to be hydrated on the client so no new requests are made. Then, during client-side navigation (post first-render), a JSON request is fired to an endpoint automatically registered for running the `getData()` function for that route on the server.

The objet returned by `getData()` gets automatically assigned as `data` in the [universal route context](https://github.com/fastify/fastify-dx/blob/main/docs/solid/route-context.md) object and is accessible from `getMeta()` and `onEnter()` hooks and also via the `useRouteContext()` hook.

```jsx
import { useRouteContext } from '/dx:core.js'

export function getData (ctx) {
  return {
    message: 'Hello from getData!',
  }
}

export default function Route (props) {
  const { data } = useRouteContext()
  return <p>{data.message}</p>
}
```

## Route Layouts

Fastify DX will automatically load layouts from the `layouts/` folder. By default, `/dx:layouts/default.jsx` is used — that is, if a project is missing a `layouts/defaults.jsx` file, the one provided by Fastify DX is used instead. 

See the section on [Virtual Modules](https://github.com/fastify/fastify-dx/blob/main/docs/solid/virtual-modules.md) to learn more about this.

You assign a layout to a route by exporting `layout`. 

See [`pages/using-auth.jsx`](https://github.com/fastify/fastify-dx/blob/main/starters/solid/pages/using-auth.jsx) in the starter template:

```js
export const layout = 'auth'
```

That'll will cause the route to be wrapped in the layout component exported by [`layouts/auth.jsx`](https://github.com/fastify/fastify-dx/blob/main/starters/solid/layouts/auth.jsx):

```jsx
import { useRouteContext } from '/dx:core.js'

export default function Auth (props) {
  const { actions, state } = useRouteContext()
  const authenticate = () => actions.authenticate(state)
  return (
    <div class="contents">
      {state.user.authenticated
        ? props.children
        : <Login onClick={() => authenticate()} /> }
    </div>
  )
}

function Login (props) {
  return (
    <>
      <p>This route needs authentication.</p>
      <button onClick={props.onClick}>
        Click this button to authenticate.
      </button>
    </>
  )
}
```

Note that like routes, it has access to `useRouteContext()`.

## Route Context

### Initialization module
  
The starter template includes a sample `context.js` file. This file is optional and can be safely removed. If it's present, Fastify DX automatically loads it and uses it to do any RouteContext extensions or data injections you might need. If you're familiar with [Nuxt.js](https://nuxtjs.org/), you can think of it as a [Nuxt.js plugin](https://nuxtjs.org/docs/directory-structure/plugins/).

**Consuming the route context:**

```js
import { 
  useRouteContext
} from '/dx:core.js'

// ...
const { 
  state, 
  actions
} = useRouteContext()

// ...
actions.addTodoItem(state, value)
```

See the [full example](https://github.com/fastify/fastify-dx/blob/main/starters/solid/client/pages/using-store.vue) in the starter template.

This example demonstrates how to use it to set up an universally available (SSR and CSR) `$fetch` function (using [`ky-universal`](https://www.npmjs.com/package/ky-universal)) and also export some store actions. They're all made available by `useRouteContext()`, covered next.

```js
import ky from 'ky-universal'

export default (ctx) => {
  if (ctx.server) {
    // Populate state.todoList on the server
    ctx.state.todoList = ctx.server.db.todoList
    // It'll get automatically serialized to the client on first render!
  }
}

export const $fetch = ky.extend({
  prefixUrl: 'http://localhost:3000'
})

// Must be a function so each request can have its own state
export const state = () => ({
  todoList: null,
})

export const actions = {
  async addTodoItem (state, item) {
    await $fetch.put('api/todo/items', {
      json: { item },
    })
    state.todoList.push(item)
  },
}
```

See the [full example](https://github.com/fastify/fastify-dx/blob/main/starters/solid/client/context.js) in the starter template.

### The `useRouteContext()` hook

This hook can be used in any Vue component to retrieve a reference to the current route context. It's modelled after the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md), with still some rough differences and missing properties in this **alpha release**.

By default, It includes reference to `data` — which is automatically populated if you use the `getData()` function, and `state` which hold references to the global [`reactive()`](https://vuejs.org/api/reactivity-core.html#reactive) object.

It automatically causes the component to be suspended if the `getData()`, `getMeta()` and `onEnter()` functions are asynchronous.

```jsx
import { useRouteContext } from '/dx:core.js'

export default function Route (props) {
  const { data } = useRouteContext()
  return <p>{data.message}</p>
}
```

### Execution order

This graph illustrates the execution order to expect from route context initialization.

```
context.js default function export
└─ getData() function export
   └─ getMeta() function export
      └─ onEnter() function export
         └─ Route module
```

First the `default` function export from `context.js` (if present) is executed. This is where you can manually feed global server data into your application by populating the global state (the route context's `state` property, which is automatically hydrated on the client.

Then `getData()` runs — which populates the route context's `data` property, and is also automatically hydrated on the client. Then `getMeta()`, which populates the route context's `head` property. Then `onEnter()`, and finally your route component.

## Universal Route Enter Event

### `onEnter(ctx)`

If a route module exports a `onEnter()` function, it's executed before the route renders, both in SSR and client-side navigation. That is, the first time a route render on the server, onEnter() runs on the server. Then, since it already ran on the server, it doesn't run again on the client for that first route. But if you navigate to another route on the client using `<Link>`, it runs normally as you'd expect.

It receives the [universal route context][route-context] as first parameter, so you can make changes to `data`, `meta` and `state` if needed.

[route-context]: https://github.com/fastify/fastify-dx/blob/main/docs/solid/route-context.md

```jsx
export function onEnter (ctx) {
  if (ctx.server?.underPressure) {
    ctx.clientOnly = true
  }
}

export default function Route (props) {
  <p>No pre-rendered HTML sent to the browser.</p>
}
```

The example demonstrates how to turn off SSR and downgrade to CSR-only, assuming you have a `pressureHandler` configured in [`underpressure`](https://github.com/fastify/under-pressure) to set a `underPressure` flag on your server instance.


## Meta Tags

Following the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md), Fastify DX renders `<head>` elements independently from the SSR phase. This allows you to fetch data for populating the first `<meta>` tags and stream them right away to the client, and only then perform SSR.

> Additional `<link>` preload tags can be produced from the SSR phase. This is **not currently implemented** in this **alpha release** but is a planned feature. If you can't wait for it, you can roll out your own (and perhaps contribute your solution) by providing your own [`createHtmlFunction()`](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/index.js#L57) to [fastify-vite](https://github.com/fastify/fastify-vite).

### `getMeta()`

To populate `<title>`, `<meta>` and `<link>` elements, export a `getMeta()` function that returns an object matching the format expected by [unihead](https://github.com/galvez/unihead), the underlying library used by Fastify DX.
  
It receives the [route context](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/README.md#route-context) as first parameter and runs after `getData()`, allowing you to access any `data` populated by these other functions to generate your tags.

```jsx
export function getMeta (ctx) {
  return {
    title: 'Route Title',
    meta: [
      { name: 'twitter:title', value: 'Route Title' },
    ]
  }
}

export default function Route (props) {
  return <p>Route with meta tags.</p>
}
```


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


## Maintainance

Created and maintained by [Jonas Galvez](https://github.com/sponsors/galvez), **Principal Engineer** and **Open Sourcerer** at [NodeSource](https://nodesource.com).

New contributors are extremely welcome to look for [good first issues](https://github.com/fastify/fastify-dx/labels/good%20first%20issue).

## Gold Sponsors

<a href="https://nodesource.com"><img width="200px" src="https://user-images.githubusercontent.com/12291/206885948-3fa742a2-1057-4db2-8648-46f5cb673461.svg"></a>

[Contact me](mailto:jonasgalvez@gmail.com) to add your company's logo here.

## GitHub Sponsors

- [**Duc-Thien Bui**](https://github.com/aecea)
- [**Tom Preston-Werner**](https://github.com/mojombo) 
- [**Clifford Fajardo**](https://github.com/cliffordfajardo)
- [**David Adam Coffey**](https://github.com/dacoffey)
- [**Mezereon**](https://github.com/mezereon-co)
- [**A-J Roos**](https://github.com/Asjas)
- [**James Isaacs**](https://github.com/jamesisaacs2)

[**Click here**](https://github.com/sponsors/galvez) to add your name to this list.

_Thank you!_
