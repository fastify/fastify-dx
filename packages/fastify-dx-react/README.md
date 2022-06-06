# fastify-dx-react [![NPM version](https://img.shields.io/npm/v/fastify-dx-react.svg?style=flat)](https://www.npmjs.com/package/fastify-dx-react) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

## Quick Start

<table>
<tr>
<td width="400px" valign="top">

<br>

Ensure you have Node v16+.

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
- A `pages/` folder with some [demo routes]().
- All configuration files.

It also includes some _**opinionated**_ essentials:

- [**UnoCSS**](https://github.com/unocss/unocss) by [**Anthony Fu**](https://antfu.me/), which supports all [Tailwind utilities](https://uno.antfu.me/) and many other goodies through its [default preset](https://github.com/unocss/unocss/tree/main/packages/preset-uno). 200x faster than Tailwind.

- [**Valtio**](https://github.com/pmndrs/valtio) by [**Daishi Kato**](https://blog.axlight.com/), with a global and SSR-ready store which you can populate on the server (via the Route Context [intialization file]()) and expect it to be automatically hydrated on the client. It delivers simple and idiomatic state management, leveraging [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) without compromising React rendering efficiency.

</td>
</tr>
</table>
  
## Install
  
<table>
<tr>
<td width="400px" valign="top">

<br>
  
If you're starting a project from scratch, you'll need these packages installed.

</td>
<td width="600px" valign="top"><br>

```bash
npm i fastify fastify-vite fastify-dx-react -P
npm i @vitejs/plugin-react -D
```

</td>
</tr>
</table>


## Structure

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
  
Several internal files are provided as virtual modules by Fastify DX. They are located inside the `fastify-dx-react` package in `node_modules`, and dynamically loaded so you don't have to worry about them unless you want them overriden. In this case, placing a file with the same name as the registered virtual module in your Vite project root will override it. You'll find the detailed rundown of all virtual modules [later in this README]().

</td>
<td width="600px"><br>

The `server.js` file is your application entry point. It's the file that runs everything. It boots a Fastify server configured with [**fastify-vite**]() and **Fastify DX for React** as a renderer adapter to **fastify-vite**. 
  
The `client/context.js` file is the universal [route context]() initialization module. Any named exports from this file are attached to the RouteContext class prototype on the server, preventing them from being reassigned on every request. The `default` export from this file, however, runs for every request so you can attach any request-specific data to it.
  
The `client/index.html` file is the root HTML template of the application, which Vite uses as the client bundling entry point. You can expand this file with additional `<meta>` and `<link>` tags if you wish, provided you don't remove any of the placeholders. This files links to `/dx:mount.js`, which is a virtual module provided by Fastify DX. Virtual modules are covered [later in this README]().
  
The `client/pages/` directory contains your route modules, whose paths are dynamically inferred from the directory structure itself. You can change this behavior easily. More on this [later in this README]().

The `client/index.js` file is your Vite server entry point, it's the file that provides your client bundle (which runs in the Vite-enriched environment) to the Node.js environment where Fastify runs. 

> Right now, it's mostly a **boilerplate file** because it must exist but it will also probably never need to be changed.

It exports your application's root React component (must be named `create`), the application routes (must be named `routes`) and the universal route context [initialization module]() (must be named `context` and have a dynamic module import so Fastify DX can pick up both its `default` and named exports.
  
</td>
</tr>
</table>

## Usage

<table>
<tr>
<td width="400px" valign="top">

### Basic server setup

The [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/react) follows [fastify-vite](https://github.com/fastify/fastify-vite)'s convention of having a `client` folder with an `index.js` file, which is automatically resolved as your `clientModule` setting. 

If you want flat directory setup, where server and client files are mixed together, you can manually set `clientModule` to something else. Note that you'll also need to update `root` in your `vite.config.js` file.

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
  
</td>
</tr>
</table>
  
<table>
<tr>
<td width="400px" valign="top">

<br>
  
### Vite configuration

</td>
<td width="600px"><br>

The starter template's `vite.config.js` file:

```js
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import viteReact from '@vitejs/plugin-react'
import viteReactFastifyDX from 'fastify-dx-react/plugin'

const path = fileURLToPath(import.meta.url)

const root = join(dirname(path), 'client')
const plugins = [viteReact(), viteReactFastifyDX()]

export default { root, plugins }
```

Note that you only need to use Fastify DX's Vite plugin, which includes all functionality from the [fastify-vite's Vite plugin]().

</td>
</tr>
</table>

## Routing mode

By default, routes are loaded from the `<project-root>/pages` folder, where `<project-root>` refers to the `root` setting in `vite.config.js`. The route paths are dynamically inferred from the directory structure, very much like Next.js and Nuxt.js.

<table>
<tr>
<td width="400px" valign="top">

Dynamic route parameters follow the [Next.js convention](https://nextjs.org/docs/basic-features/pages#pages-with-dynamic-routes) (`[param]`), but that can be overriden by using the `paramPattern` plugin option. For example, the following configuration switches the param pattern to the [Remix convention](https://remix.run/docs/en/v1/guides/routing#dynamic-segments) (`$param`):

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

You can also change the glob pattern used to determine where to route modules from. Since this setting is passed to [Vite's glob importers](https://vitejs.dev/guide/features.html#glob-import), the value needs to be a string:


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

You also can export a `path` constant from your route modules, in which case its value will be used to **override the dynamically inferred paths from the directory structure**.

Finally, you can also provide your own routes. See the section on the `routes.js` virtual module provided by Fastify DX to see how to do this.

## Rendering mode

Following the URMA specification, Fastify DX's route module can be set to be universally rendered (default behavior), server-side rendered in streaming mode, server-side rendered only (client gets no JavaScript) or client rendered only (no rendering takes place on the server).

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

[See the full example]() in the [starter boilerplate]().

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `serverOnly`

If a route module exports `serverOnly` set to `true`, only SSR will take place. The client gets the server-side rendered markup without any accompanying JavaScript or data hydration.

You should use this setting to deliver lighter pages when there's no need to run any code on them, such as statically generated content sites.

This differs from [React Server Components](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md), which are also supported, but whose server-only rendering is more granular (available for any route child component) and fully controlled by the React runtime.

</td>
<td width="600px"><br>

```jsx
export const serverOnly = true
  
export function Index () {
  return <p>No JavaScript sent to the browser.</p>
}
```

[This example]() is part of the [starter boilerplate]().

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `clientOnly`

If a route module exports `clientOnly` set to `true`, no SSR will take place, only data fetching and data hydration. The client gets the empty container element (the one that wraps `<!-- element -->` in `index.html`) and all rendering takes place on the client only.

You can use this setting to save server resources on internal pages where SSR makes no significant diference for search engines or UX in general, such as a password-protected admin section.

This differs from [React Client Components](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md), which are also supported, but clientserver-only rendering is more granular (available for any route child component) and fully controlled by the React runtime.

</td>
<td width="600px"><br>

```jsx
export const clientOnly = true
  
export function Index () {
  return <p>No pre-rendered HTML sent to the browser.</p>
}
```

[This example]() is part of the [starter boilerplate]().

</td>
</tr>
</table>


## HTML meta tag management

Following the [URMA specification](), Fastify DX renders `<head>` elements independently from the SSR phase. This allows you to fetch data for populating the first `<meta>` tags and stream them right away to the client, and only then stream the server-side rendered application body.

<table>
<tr>
<td width="400px" valign="top">

### `getMeta()`

To populate `<title>`, `<meta>` and `<link>` elements, export a `getMeta()` function that returns an object matching the format expected by [unihead](https://github.com/galvez/unihead), the underlying library used by Fastify DX.
  
It receives the [route context]() as first parameter and runs after `onEnter()`, `getData()`, allowing you to access any `data` populated by these other functions to generate your tags.

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

[This example]() is part of the [starter boilerplate]().

</td>
</tr>
</table>

## Isomorphic data prefetching

The only way for the React runtime to execute asynchronous operations prior the rendering of a component is through the Suspense API. Fastify DX implements the `getData()` hook from the URMA specification to solve this problem.

<table>
<tr>
<td width="400px" valign="top">

### `getData(ctx)`

This hook is set up in a way that it runs server-side before any SSR takes place, so any data fetched is made available to the route component before it starts rendering. During first render, any data retrieved on the server is automatically sent to be hydrated on the client so no new requests are made. Then, during client-side navigation (post first-render), a JSON request is fired to an endpoint automatically registered for running the getData() function for that route on the server.

The objet returned by `getData()` gets automatically assigned as `data` in the [universal route context]() object and is accessible from `getMeta()` and `onEnter()` hooks and also via the `useRouteContext()` hook.

</td>
<td width="600px"><br>

```jsx
import { useRouteContext } from '/dx:context'

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

[This example]() is part of the [starter boilerplate]().

</td>
</tr>
</table>

## Universal route enter handler

<table>
<tr>
<td width="400px" valign="top">

### `onEnter(ctx)`

If a route module exports a `onEnter()` function, it's executed before the route renders, both in SSR and client-side navigation. That is, the first time a route render on the server, onEnter() runs on the server. Then, since it already ran on the server, it doesn't run again on the client for that first route. But if you navigate to another route on the client using `<Link>`, it runs normally as you'd expect.

It receives the [universal route context]() as first parameter, so you can make changes to `data`, `meta` and `state` if needed.

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

### Initialization file
  
The starter template includes a sample `context.js` file. This file is optional and can be safely removed. If it's present, Fastify DX automatically loads it and uses it to do any RouteContext extensions or data injections you might need. If you're familiar with [Nuxt.js](https://nuxtjs.org/), you can think of it as a [Nuxt.js plugin](https://nuxtjs.org/docs/directory-structure/plugins/).



</td>
<td width="600px"><br>

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

export async function addTodoListItem (state, item) {
  await $fetch.put('api/todo/items', {
    body: { item },
  })
  state.todoList.push(item)
}
```

[This example](https://github.com/fastify/fastify-dx/blob/dev/starters/react/client/context.js) is part of the [starter boilerplate](https://github.com/fastify/fastify-dx/tree/dev/starters/react).

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### The `useRouteContext()` hook

</td>
<td width="600px"><br>

```jsx
import { useRouteContext } from '/dx:context'
  
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

</td>
<td width="600px"><br>

```
├─ Route context initialization module
│  ├─ getData()
│  ├─ getMeta()
│  └─ onEnter()
└─ YourRoute()
```

</td>
</tr>
</table>

## Virtual Modules

<table>
<tr>
<td width="400px" valign="top">

### `/dx:base.jsx`

The `base.jx` virtual import holds your root React component.

</td>
<td width="600px"><br>

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

</td>
<td width="600px"><br>

```js
import create from '/dx:base.jsx'
import routes from '/dx:routes'

mount('main', { create, routes })
```

[See the full file](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/virtual/mount.js) for the `mount()` function definition.

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:routes`

Fastify DX has code-splitting out of the box. It does that by eagerly loading all route data on the server, and then hydrating any missing metadata on the client. That's why the routes module default export is conditioned to `import.meta.env.SSR`, and different helper functions are called for each rendering environment.

</td>
<td width="600px"><br>

```js
export default import.meta.env.SSR
  ? createRoutes(import.meta.globEager('$globPattern'))
  : hydrateRoutes(import.meta.glob('$globPattern'))
```

See [the full file](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/virtual/base.jsx) for the `createRoutes()` and `hydrateRoutes()` definitions. If you want to use your own custom routes list, just replace the glob imports with your own routes list:

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

See its full definition [here]().

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

You'll rarely need to customize this file.

See its full definition [here](https://github.com/fastify/fastify-dx/blob/dev/packages/fastify-dx-react/virtual/resource.js).

</td>
</tr>
</table>
