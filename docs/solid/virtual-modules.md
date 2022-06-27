<sub>**Go back to the [index](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/README.md).**</sub>

<br>

## Virtual Modules

**Fastify DX** relies on [virtual modules](https://github.com/rollup/plugins/tree/master/packages/virtual) to save your project from having too many boilerplate files. Virtual modules are a [Rollup](https://rollupjs.org/guide/en/) feature exposed and fully supported by [Vite](https://vitejs.dev/). When you see imports that start with `/dx:`, you know a Fastify DX virtual module is being used.

Fastify DX virtual modules are **fully ejectable**. For instance, the starter template relies on the `/dx:root.svelte` virtual module to provide the Vue shell of your application. If you copy the `root.svelte` file [from the fastify-dx-svelte package](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-svelte/virtual/root.svelte) and place it your Vite project root, **that copy of the file is used instead**. In fact, the starter template already comes with a custom `root.svelte` of its own to include UnoCSS.

Aside from `root.svelte`, the starter template comes with two other virtual modules already ejected and part of the local project — `context.js` and `layouts/default.svelte`. If you don't need to customize them, you can safely removed them from your project.

### `/dx:root.jsx`

This is the root Solid component. It's provided as part of the starter template. You can use this file to add a common layout to all routes. The version provided as part of the starter template includes [UnoCSS](https://github.com/unocss/unocss)'s own virtual module import, necessary to enable its CSS engine.

```jsx

```

### `/dx:route.svelte`

This is used by `root.svelte` to enhance your route modules with the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md).

<b>You'll rarely need to customize this file.</b>

```html
<script>
import { setContext } from 'svelte'
import Loadable from 'svelte-loadable'
import { routeContext, jsonDataFetch } from '/dx:core.js'
import layouts from '/dx:layouts.js'

const isServer = import.meta.env.SSR

setContext(routeContext, {
  get routeContext () {
    return ctx
  }
})

export let path
export let component
export let payload
export let state
export let location

let ctx = payload.routeMap[path]

ctx.state = state
ctx.actions = payload.serverRoute.actions  

if (isServer) {
  ctx.layout = payload.serverRoute.layout ?? 'default'
  ctx.data = payload.serverRoute.data
  ctx.state = state
}

async function setup () {
  if (payload.serverRoute.firstRender) {
    ctx.data = payload.serverRoute.data
    ctx.layout = payload.serverRoute.layout ?? 'default'
    payload.serverRoute.firstRender = false
    return
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
      payload.head.update(updatedMeta)
    }
  }
  if (onEnter) {
    const updatedData = await onEnter(ctx)
    if (updatedData) {
      Object.assign(ctx.data, updatedData)
    }
  }
}

let setupClientRouteContext = !isServer && setup()
</script>

{#if isServer}
  <svelte:component this={layouts[ctx.layout].default}>
    <svelte:component this={component} />
  </svelte:component>
{:else}
{#await setupClientRouteContext}{:then}
  <svelte:component this={layouts[ctx.layout].default}>
    <Loadable loader={component} />
  </svelte:component>
{/await}
{/if}
```

What you see above is its [full definition](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-svelte/virtual/route.svelte).


### `/dx:routes.js`

Fastify DX has **code-splitting** out of the box. It does that by eagerly loading all route data on the server, and then hydrating any missing metadata on the client. That's why the routes module default export is conditioned to `import.meta.env.SSR`, and different helper functions are called for each rendering environment.

```js
export default import.meta.env.SSR
  ? createRoutes(import.meta.globEager('$globPattern'))
  : hydrateRoutes(import.meta.glob('$globPattern'))
```

See [the full file](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-svelte/virtual/routes.js) for the `createRoutes()` and `hydrateRoutes()` definitions. 

If you want to use your own custom routes list, you must eject this file as-is and replace the glob imports with your own routes list:

```js
const routes = [
  { 
    path: '/', 
    component: () => import('/custom/index.svelte'),
  }
]

export default import.meta.env.SSR
  ? createRoutes(routes)
  : hydrateRoutes(routes)
````

**Nested routes aren't supported yet.**


### `/dx:core.js`

Implements `useRouteContext()`.

See its full definition [here](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-svelte/virtual/core.js).

### `/dx:layouts.js`

This is responsible for loading **layout components**. It's part of `route.svelte` by default. If a project has no `layouts/default.svelte` file, the default one from Fastify DX is used. This virtual module works in conjunction with the `/dx:layouts/` virtual module which provides exports from the `/layouts` folder.

<b>You'll rarely need to customize this file.</b>

```js
import DefaultLayout from '/dx:layouts/default.svelte'

const appLayouts = import.meta.globEager('/layouts/*.svelte')

appLayouts['/layouts/default.svelte'] ??= DefaultLayout

export default Object.fromEntries(
  Object.keys(appLayouts).map((path) => {
    const name = path.slice(9, -7)
    return [name, appLayouts[path]]
  }),
)

```

What you see above is its [full definition](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-svelte/virtual/layouts.js).

### `/dx:mount.js`

This is the file `index.html` links to by default. It sets up the application with an `unihead` instance for head management, the initial route context, and provides the conditional mounting logic to defer to CSR-only if `clientOnly` is enabled.

<b>You'll rarely need to customize this file.</b>

[See the full file](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-svelte/virtual/mount.js) for the `mount()` function definition.
