# fastify-dx-react [![NPM version](https://img.shields.io/npm/v/fastify-dx-react.svg?style=flat)](https://www.npmjs.com/package/fastify-dx-react) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

## Quick Start

<table>
<tr>
<td width="400px" valign="top">

<br>

Ensure you have **Node v16+**.

Make a copy of [**starters/react**](https://github.com/fastify/fastify-dx/tree/dev/starters/react). If you have [`degit`](https://github.com/Rich-Harris/degit), run the following from a new directory:

```bash
degit fastify/fastify-dx/starters/react
```

Run `npm install`. 

`npm run dev` boots the development server.
  
`npm run build` creates the production bundle.
  
`npm run serve` serves the production bundle.

</td>
<td width="600px"><br>

That will get you a **starter template** with:
  
- A minimal [Fastify](https://github.com/fastify/fastify) server.
- Some dummy API routes.
- A `pages/` folder with some [demo routes](https://github.com/fastify/fastify-dx/tree/dev/starters/react/client/pages).
- All configuration files.

It also includes some _**opinionated**_ essentials:

- [**UnoCSS**](https://github.com/unocss/unocss) by [**Anthony Fu**](https://antfu.me/), which supports all [Tailwind utilities](https://uno.antfu.me/) and many other goodies through its [default preset](https://github.com/unocss/unocss/tree/main/packages/preset-uno). 200x faster than Tailwind.

- [**Valtio**](https://github.com/pmndrs/valtio) by [**Daishi Kato**](https://blog.axlight.com/), with a global and SSR-ready store which you can populate on the server (via the Route Context [intialization file](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/README.md#initialization-file)) and expect it to be automatically hydrated on the client. It delivers simple and idiomatic state management, leveraging [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) without compromising React rendering efficiency.

</td>
</tr>
</table>
  
## Manual Install
  
<table>
<tr>
<td width="400px" valign="top">

<br>
  
**If you're starting a project from scratch**, you'll need these packages installed.

</td>
<td width="600px" valign="top"><br>

```bash
npm i fastify fastify-vite fastify-dx-react -P
npm i @vitejs/plugin-react -D
```

</td>
</tr>
</table>


## Project Structure

<table>
<tr>
<td width="400px" valign="top">

<br>

The [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/react) looks like this:

```
├── server.js
├── client/
｜    ├── index.js
｜    ├── context.js
｜    ├── index.html
｜    └── pages/
｜          ├── index.jsx
｜          ├── client-only.jsx
｜          ├── server-only.jsx
｜          ├── streaming.jsx
｜          ├── input-form.jsx
｜          ├── using-data.jsx
｜          └── using-store.jsx
├── vite.config.js
└── package.json
```
  
Several internal files are provided as virtual modules by Fastify DX. They are located inside the `fastify-dx-react` package in `node_modules`, and dynamically loaded so you don't have to worry about them unless you want them overriden. In this case, placing a file with the same name as the registered virtual module in your Vite project root will override it. You'll find the detailed rundown of all virtual modules [later in this README](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/README.md#virtual-modules).

</td>
<td width="600px"><br>

The `server.js` file is your application entry point. It's the file that runs everything. It boots a Fastify server configured with [**fastify-vite**](https://github.com/fastify/fastify-vite) and **Fastify DX for React** as a renderer adapter to **fastify-vite**. 
  
The `client/context.js` file is the universal [route context](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/README.md#route-context) initialization module. Any named exports from this file are attached to the `RouteContext` class prototype on the server, preventing them from being reassigned on every request. The `default` export from this file, however, runs for every request so you can attach any request-specific data to it.
  
The `client/index.html` file is the [root HTML template of the application](https://vitejs.dev/guide/#index-html-and-project-root), which Vite uses as the client bundling entry point. 

> You can expand this file with additional `<meta>` and `<link>` tags if you wish, provided you don't remove any of the placeholders. 

This files links to `/dx:mount.js`, which is a virtual module provided by Fastify DX. Virtual modules are covered [later in this README](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/README.md#virtual-modules).
  
The `client/pages/` directory contains your route modules, whose paths are dynamically inferred from the directory structure itself. You can change this behavior easily. More on this [later in this README](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/README.md#routing-mode).

The `client/index.js` file is your Vite server entry point, it's the file that provides your client bundle (which runs in the Vite-enriched environment) to the Node.js environment where Fastify runs. 

> Right now, it's mostly a **boilerplate file** because it must exist but it will also probably never need to be changed.

It exports your application's root React component (must be named `create`), the application routes (must be named `routes`) and the universal route context [initialization module](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/README.md#initialization-module) (must be named `context` and have a dynamic module import so Fastify DX can pick up `default` and named exports).
  
</td>
</tr>
</table>

## Usage

<table>
<tr>
<td width="400px" valign="top">

### Basic setup

The [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/react) follows [fastify-vite](https://github.com/fastify/fastify-vite)'s convention of having a `client` folder with an `index.js` file, which is automatically resolved as your `clientModule` setting. 

If you want flat directory setup, where server and client files are mixed together, you can manually set `clientModule` to something else. Note that in this case you'll also need to update `root` in your `vite.config.js` file.

When deploying to production, bear in mind the `client/dist` directory, generated when you run `npm run build`, needs to be included. You'll also want to enable Fastify's [built-in logging](https://www.fastify.io/docs/latest/Reference/Logging/):

```js
const server = Fastify({ logger: true })
```

</td>
<td width="600px"><br>

The starter template's `server.js` file:

```js
import Fastify from 'fastify'
import FastifyVite from 'fastify-vite'
import FastifyDXReact from 'fastify-dx-react'

const server = Fastify()

await server.register(FastifyVite, { 
  root: import.meta.url, 
  renderer: FastifyDXReact,
})

await server.vite.ready()
await server.listen(3000)
```

The starter template's [`vite.config.js`](https://github.com/fastify/fastify-dx/blob/dev/starters/react/vite.config.js) file:

```js
import viteReact from '@vitejs/plugin-react'
import viteReactFastifyDX from 'fastify-dx-react/plugin'
import unocss from 'unocss/vite'

const path = fileURLToPath(import.meta.url)

const root = join(dirname(path), 'client')
const plugins = [
  viteReact(), 
  viteReactFastifyDX(), 
  unocss()
]

export default { root, plugins }
```

Note that you only need to use Fastify DX's Vite plugin, which includes all functionality from [fastify-vite](https://github.com/fastify/fastify-vite)'s Vite plugin.

</td>
</tr>
</table>

## Routing mode

By default, routes are loaded from the `<project-root>/pages` folder, where `<project-root>` refers to the `root` setting in `vite.config.js`. The route paths are dynamically inferred from the directory structure, very much like Next.js and Nuxt.js.

<table>
<tr>
<td width="400px" valign="top">

### Dynamic parameters

Dynamic route parameters follow the [Next.js convention](https://nextjs.org/docs/basic-features/pages#pages-with-dynamic-routes) (`[param]`), but that can be overriden by using the `paramPattern` plugin option. For example, this configuration switches the param pattern to the [Remix convention](https://remix.run/docs/en/v1/guides/routing#dynamic-segments) (`$param`).

</td>
<td width="600px"><br>

```js
// ...
const plugins = [
  // ...
  viteReactFastifyDX({ paramPattern: /\$(\w+)/ }),
]
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### Routes location

You can also change the glob pattern used to determine where to route modules from. 

Since this setting is passed to [Vite's glob importers](https://vitejs.dev/guide/features.html#glob-import), the value needs to be a string:

</td>
<td width="600px"><br>

```js
// ...
const plugins = [
  // ...
  viteReactFastifyDX({ globPattern: '/views/**/*.jsx' }),
]
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### View modules

You also can export a `path` constant from your route modules, in which case its value will be used to **override the dynamically inferred paths from the directory structure**. 

Additionally, [**you can provide your own routes**](https://github.com/fastify/fastify-dx/tree/dev/packages/fastify-dx-react#dxroutesjs).

</td>
<td width="600px"><br>

```jsx
export const path = '/my-page'

export defaut function MyPage () {
  return <p>Route with path export</p>
}
```

</td>
</tr>
</table>

## Rendering mode

Following the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md), Fastify DX's route modules can be set for universal rendering (SSR + CSR hydration, the default behavior), SSR in streaming mode, SSR only (client gets no JavaScript) or CSR only (SSR fully disabled).

<table>
<tr>
<td width="400px" valign="top">

### `streaming`

If a route module exports `streaming` set to `true`, SSR will take place in **streaming mode**. That means if you have components depending on asynchronous resources and `<Suspense>` sections with defined fallback components, they will be streamed right way while the resources finish processing.

</td>
<td width="600px"><br>

```jsx
import React, { Suspense } from 'react'

export const streaming = true

export default function Index () {
  return (
    <Suspense fallback={<p>Waiting for content</p>}>
      <Message />
    </Suspense>
  )
}

function Message () {
  const message = afterSeconds({
    id: 'index', 
    message: 'Delayed by Suspense API',
    seconds: 5
  })
  return <p>{message}</p>
}
```

[See the full example](https://github.com/fastify/fastify-dx/blob/dev/starters/react/client/pages/streaming.jsx) in the [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/react).

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `serverOnly`

If a route module exports `serverOnly` set to `true`, only SSR will take place. The client gets the server-side rendered markup without any accompanying JavaScript or data hydration.

You should use this setting to deliver lighter pages when there's no need to run any code on them, such as statically generated content sites.

This differs from [React Server Components](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md), which are also supported, but whose server-only rendering is more granular (available for any route child component) and fully controlled by React.

</td>
<td width="600px"><br>

```jsx
export const serverOnly = true
  
export function Index () {
  return <p>No JavaScript sent to the browser.</p>
}
```

[This example](https://github.com/fastify/fastify-dx/blob/dev/starters/react/client/pages/server-only.jsx) is part of the [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/react).

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `clientOnly`

If a route module exports `clientOnly` set to `true`, no SSR will take place, only data fetching and data hydration. The client gets the empty container element (the one that wraps `<!-- element -->` in `index.html`) and all rendering takes place on the client only.

You can use this setting to save server resources on internal pages where SSR makes no significant diference for search engines or UX in general, such as a password-protected admin section.

This differs from [React Client Components](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md), which are also supported, but rendering is more granular (available for any route child component) and fully controlled by React.

</td>
<td width="600px"><br>

```jsx
export const clientOnly = true
  
export function Index () {
  return <p>No pre-rendered HTML sent to the browser.</p>
}
```

[This example](https://github.com/fastify/fastify-dx/blob/dev/starters/react/client/pages/client-only.jsx) is part of the [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/react).

</td>
</tr>
</table>


## Meta Tags

Following the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md), Fastify DX renders `<head>` elements independently from the SSR phase. This allows you to fetch data for populating the first `<meta>` tags and stream them right away to the client, and only then perform SSR.

> Additional `<link>` preload tags can be produced from the SSR phase. This is **not currently implemented** in this **alpha release** but is a planned feature. If you can't wait for it, you can roll out your own (and perhaps contribute your solution) by providing your own [`createHtmlFunction()`](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/index.js#L57) to [fastify-vite](https://github.com/fastify/fastify-vite).

<table>
<tr>
<td width="400px" valign="top">

### `getMeta()`

To populate `<title>`, `<meta>` and `<link>` elements, export a `getMeta()` function that returns an object matching the format expected by [unihead](https://github.com/galvez/unihead), the underlying library used by Fastify DX.
  
It receives the [route context](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/README.md#route-context) as first parameter and runs after `getData()`, allowing you to access any `data` populated by these other functions to generate your tags.

</td>
<td width="600px"><br>

```jsx
export function getMeta (ctx) {
  return {
    title: 'Route Title',
    meta: [
      { name: 'twitter:title', value: 'Route Title' },
    ]
  }
}

export function Index () {
  return <p>Route with meta tags.</p>
}
```

</td>
</tr>
</table>

## Isomorphic data prefetching

The only way for the React runtime to execute asynchronous operations prior the rendering of a component is through the Suspense API. Fastify DX implements the `getData()` hook from the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md) to solve this problem.

<table>
<tr>
<td width="400px" valign="top">

### `getData(ctx)`

This hook is set up in a way that it runs server-side before any SSR takes place, so any data fetched is made available to the route component before it starts rendering. During first render, any data retrieved on the server is automatically sent to be hydrated on the client so no new requests are made. Then, during client-side navigation (post first-render), a JSON request is fired to an endpoint automatically registered for running the getData() function for that route on the server.

The objet returned by `getData()` gets automatically assigned as `data` in the [universal route context](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/README.md#route-context) object and is accessible from `getMeta()` and `onEnter()` hooks and also via the `useRouteContext()` hook.

</td>
<td width="600px"><br>

```jsx
import { useRouteContext } from '/dx:router.jsx'

export function getData (ctx) {
  return {
    message: 'Hello from getData!',
  }
}

export function Index () {
  const { data } = useRouteContext()
  return <p>{data.message}</p>
}
```

</td>
</tr>
</table>

## Universal route enter event

<table>
<tr>
<td width="400px" valign="top">

### `onEnter(ctx)`

If a route module exports a `onEnter()` function, it's executed before the route renders, both in SSR and client-side navigation. That is, the first time a route render on the server, onEnter() runs on the server. Then, since it already ran on the server, it doesn't run again on the client for that first route. But if you navigate to another route on the client using `<Link>`, it runs normally as you'd expect.

It receives the [universal route context](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/README.md#route-context) as first parameter, so you can make changes to `data`, `meta` and `state` if needed.

</td>
<td width="600px"><br>

```jsx
export function onEnter (ctx) {
  if (ctx.server?.underPressure) {
    ctx.clientOnly = true
  }
}

export function Index () {
  return <p>No pre-rendered HTML sent to the browser.</p>
}
```

The example demonstrates how to turn off SSR and downgrade to CSR-only, assuming you have a `pressureHandler` configured in [`underpressure`](https://github.com/fastify/under-pressure) to set a `underPressure` flag on your server instance.

</td>
</tr>
</table>

## Route Context

<table>
<tr>
<td width="400px" valign="top">

### Initialization module
  
The starter template includes a sample `context.js` file. This file is optional and can be safely removed. If it's present, Fastify DX automatically loads it and uses it to do any RouteContext extensions or data injections you might need. If you're familiar with [Nuxt.js](https://nuxtjs.org/), you can think of it as a [Nuxt.js plugin](https://nuxtjs.org/docs/directory-structure/plugins/).

**Consuming the route context:**

```jsx
import { 
  useRouteContext
} from '/dx:router.jsx'

// ...
const { 
  state, 
  actions
} = useRouteContext()

// ...
actions.addTodoItem(state, value)
```

See the [full example](https://github.com/fastify/fastify-dx/blob/dev/starters/react/client/pages/using-store.jsx) in the starter template.

</td>
<td width="600px"><br>

This example demonstrates how to use it to set up an universally available (SSR and CSR) `$fetch` function (using [`ky-universal`](https://www.npmjs.com/package/ky-universal)) and also export some store actions. They're all made available by `useRouteContext()`, covered next.

```js
import ky from 'ky-universal'

export default (ctx) => {
  // This runs both on the server and on the 
  // client, exactly once per HTTP request
  ctx.message = 'Universal hello'
  if (ctx.server) {
    // Place same server data on the
    // application's global state
    ctx.state = ctx.server.db
    // It is automatically hydrated on the client
    // So no need to any additional assignments here
  }
}

export const $fetch = ky.extend({
  prefixUrl: 'http://localhost:3000'
})

export async function addTodoItem (state, item) {
  await $fetch.put('api/todo/items', {
    body: { item },
  })
  state.todoList.push(item)
}
```

See the [full example](https://github.com/fastify/fastify-dx/blob/dev/starters/react/client/context.js) in the starter template.

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### The `useRouteContext()` hook

This hook can be used in any React component to retrieve a reference to the current route context. It's modelled after the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md), with still some rough differences and missing properties in this **alpha release**.

By default, It includes reference to `data` — which is automatically populated if you use the `getData()` function, and `state` and `snapshot` — which hold references to the global [Valtio](https://github.com/pmndrs/valtio) state proxy and state snapshot object (returned by Valtio's `useSnapshot()`).

It automatically causes the component to be [suspended](https://17.reactjs.org/docs/concurrent-mode-suspense.html) if the `getData()`, `getMeta()` and `onEnter()` functions are asynchronous.

</td>
<td width="600px"><br>

```jsx
import { useRouteContext } from '/dx:router.jsx'
  
export function Index () {
  const { data } = useRouteContext()
  return <p>{data.message}</p>
}
```


</td>
</tr>
</table>


<table>
<tr>
<td width="400px" valign="top">

### Execution order

This graph illustrates the execution order to expect from route context initialization.

</td>
<td width="600px"><br>

```
├─ context.js default function export
   └─ getData() function export
        └─ getMeta() function export
            └─ onEnter() function export
                └─ Route module
```

First the `default` function export from `context.js` (if present) is executed. This is where you can manually feed global server data into your application by populating the global Valtio state (the route context's `state` property, which is automatically hydrated on the client.

Then `getData()` runs — which populates the route context's `data` property, and is also automatically hydrated on the client. Then `getMeta()`, which populates the route context's `head` property. Then `onEnter()`, and finally your route component.

</td>
</tr>
</table>

## Virtual Modules

**Fastify DX** relies on [virtual modules](https://github.com/rollup/plugins/tree/master/packages/virtual) to save your project from having too many boilerplate files. Virtual modules are a [Rollup](https://rollupjs.org/guide/en/) feature exposed and fully supported by [Vite](https://vitejs.dev/). When you see imports that start with `/dx:`, you know a Fastify DX virtual module is being used.

Fastify DX virtual modules are **fully ejectable**. For instance, the starter template relies on the `/dx:base.jsx` virtual module to provide the React Router shell of your application. If you copy the `base.jsx` file [from the fastify-dx-react package](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/virtual/base.jsx) and place it your Vite project root, **that copy of the file is used instead**.

The starter template comes with two virtual modules already ejected and part of the local project — `context.js` and `layout.jsx`, because they **are supposed to be user-provided** anyway. If you absolutely don't need to customize them, you can safely removed them from your copy of the starter template.

<table>
<tr>
<td width="400px" valign="top">

### `/dx:layout.jsx`

This is the root layout React component. It's used internally by `/dx:base.jsx` and provided as part of the starter template. You can use this file to add a common layout to all routes, or just use it to add additional, custom context providers.

</td>
<td width="600px"><br>

The version provided as part of the starter template includes [UnoCSS](https://github.com/unocss/unocss)'s own virtual module import, necessary to enable its CSS engine.

```jsx
import 'virtual:uno.css'
import { Suspense } from 'react'

export default function Layout ({ children }) {
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}
```


</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:routes.js`

Fastify DX has **code-splitting** out of the box. It does that by eagerly loading all route data on the server, and then hydrating any missing metadata on the client. That's why the routes module default export is conditioned to `import.meta.env.SSR`, and different helper functions are called for each rendering environment.

</td>
<td width="600px"><br>

```js
export default import.meta.env.SSR
  ? createRoutes(import.meta.globEager('$globPattern'))
  : hydrateRoutes(import.meta.glob('$globPattern'))
```

See [the full file](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/virtual/base.jsx) for the `createRoutes()` and `hydrateRoutes()` definitions. 

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

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:router.jsx`

Implements the `BaseRouter` and `EnhancedRouter` components, both used by `base.jsx`, and also the `useRouteContext()` hook.

</td>
<td width="600px"><br>

You'll want to customize this file if you want to set up your own [React Router](https://reactrouter.com/docs/en/v6) routes component layout to leverage [nested routing](https://reactrouter.com/docs/en/v6/getting-started/concepts#nested-routes).

See its full definition [here](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/virtual/router.jsx).

</td>
</tr>
</table>


<table>
<tr>
<td width="400px" valign="top">

### `/dx:base.jsx`

The `base.jx` virtual import holds your root React component. This is where the [React Router](https://reactrouter.com/docs/en/v6) root component for your application is also set.

</td>
<td width="600px"><br>

<b>You'll rarely need to customize this file.</b>

```jsx
import React, { Suspense } from 'react'
import { BaseRouter, EnhancedRouter } from '/dx:router.jsx'

export default function Base ({ url, ...routerSettings }) {
  return (
    <BaseRouter location={url}>
      <Suspense>
        <EnhancedRouter {...routerSettings} />
      </Suspense>
    </BaseRouter>
  )
}
```

What you see above is its [full definition](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/virtual/base.jsx).

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:mount.js`

This is the file `index.html` links to by default. It sets up the application with an `unihead` instance for head management, the initial route context, and provides the conditional mounting logic to defer to CSR-only if `clientOnly` is enabled.

</td>
<td width="600px"><br>

<b>You'll rarely need to customize this file.</b>

[See the full file](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/virtual/mount.js) for the `mount()` function definition.

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:resource.js`

Provides the `waitResource()` and `waitFetch()` data fetching helpers implementing the [Suspense API](https://17.reactjs.org/docs/concurrent-mode-suspense.html). They're used by `/dx:router.jsx`.

</td>
<td width="600px"><br>

<b>You'll rarely need to customize this file.</b>

See its full definition [here](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/virtual/resource.js).

</td>
</tr>
</table>
