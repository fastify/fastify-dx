# fastify-dx-react [![NPM version](https://img.shields.io/npm/v/fastify-dx-react.svg?style=flat)](https://www.npmjs.com/package/fastify-dx-react) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

## Quick Start

<table>
<tr>
<td width="400px" valign="top">

<br>

Ensure you have Node v16+.

Make a copy of [**starters/react**](https://github.com/fastify/fastify-dx/tree/dev/starters/react).

Run `npm install`.
  
<br>

```bash
degit fastify/fastify-dx/starters/react
```
<sub>If you don't have `degit`, [read about it here](https://github.com/Rich-Harris/degit).</sub>

</td>
<td width="600px"><br>

That'll get you a **starter template** to work with, with a minimal `server.js` file, all configuration files, a `pages/` folder with some [demo routes]() demonstrating all of the features covered in this `README`, and also some opinionated essentials:

- [**UnoCSS**](https://github.com/unocss/unocss) by [**Anthony Fu**](https://antfu.me/), which supports all [Tailwind utilities](https://uno.antfu.me/) and many other goodies through its [default preset](https://github.com/unocss/unocss/tree/main/packages/preset-uno).

- [**Valtio**](https://github.com/pmndrs/valtio) by [**Daishi Kato**](https://blog.axlight.com/), with a global and SSR-ready store which you can populate on the server and expect it to be automatically hydrated on the client. It delivers simple and idiomatic state management.

</td>
</tr>
</table>


The full [starter boilerplate]() has the following structure:

```
├── server.js
├── client.js
├── context.js
├── index.html
├── pages/
│    ├── index.jsx
│    ├── client-only.jsx
│    ├── server-only.jsx
│    ├── streaming.jsx
│    ├── input-form.jsx
│    ├── using-data.jsx
│    └── using-store.jsx
├── vite.config.js
└── package.json
```

Several internal files are provided as virtual modules by Fastify DX. They are located inside the `fastify-dx-react` package in `node_modules`, and dynamically loaded so you don't have to worry about them unless you want them overriden. In this case, placing a file with the same name as the registered virtual module in your Vite project root will override it. You'll find the detailed rundown of all virtual modules [later in this README]().

## Install

If you're starting a project from scratch, you'll need these packages installed:

```bash
npm i fastify fastify-vite fastify-dx-react -P
npm i @vitejs/plugin-react -D
```

## Usage

Basic server setup:

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

The example above assumes you're following [fastify-vite](https://github.com/fastify/fastify-vite)'s convention of having a `client` folder with an `index.js` file, which is automatically resolved as your `clientModule` setting. But in order to have a flat initial setup, you can manually set `clientModule` as demonstrated by the [starter boilerplate](), which sets `/client.js` as `clientModule`.

Minimal `vite.config.js` file:

```js
import { dirname } from 'path'
import viteReact from '@vitejs/plugin-react'
import viteReactFastifyDX from 'fastify-dx-react/plugin'

export default {
  root: dirname(new URL(import.meta.url).pathname),
  plugins: [
    viteReact({ jsxRuntime: 'classic' }),
    viteReactFastifyDX(),
  ],
}
```

## Routing mode

By default, routes are loaded from the `<project-root>/pages` folder, where `<project-root>` refers to the `root` setting in `vite.config.js`. The route paths are dynamically inferred from the directory structure, very much like Next.js and Nuxt.js.

Dynamic route parameters follow the [Next.js convention](https://nextjs.org/docs/basic-features/pages#pages-with-dynamic-routes) (`[param]`), but that can be overriden by using the `paramPattern` plugin option. For example, the following configuration switches the param pattern to the [Remix convention](https://remix.run/docs/en/v1/guides/routing#dynamic-segments) (`$param`):

```js
// ...
export default {
  plugins: [
    // ...
    viteReactFastifyDX({ paramPattern: /\$(\w+)/ }),
  ],
}
```

You can also change the glob pattern used to determine where to route modules from. Since this setting is passed to [Vite's glob importers](https://vitejs.dev/guide/features.html#glob-import), the value needs to be a string:

```js
// ...
export default {
  plugins: [
    // ...
    viteReactFastifyDX({ globPattern: '/views/**/*.jsx' }),
  ],
}
```

Finally, you also can export a `path` constant from your route modules, in which case its value will be used to **override the dynamically inferred paths from the directory structure**.

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


## Decoupled `<head>`

Following the [URMA specification](), Fastify DX renders `<head>` elements independently from the SSR phase. 

This allows you to fetch data for populating the first `<meta>` tags and stream them right away to the client, and only then stream the server-side rendered application body.

<table>
<tr>
<td width="400px" valign="top">

### `getMeta()`

In order to populate `<head>` elements, export a `getMeta()` function that returns a function matching the format expected by [unihead](https://github.com/galvez/unihead), the underlying library used by Fastify DX.

</td>
<td width="600px"><br>

```jsx
export function getMeta () {
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

### `getData()`

This hook is set up in a way that it runs server-side before any SSR takes place, so any data fetched is made available to the route component before it starts rendering. During first render, any data retrieved on the server is automatically sent to be hydrated on the client so no new requests are made. Then, during client-side navigation (post first-render), a JSON request is fired to an endpoint automatically registered for running the getData() function for that route on the server.

The objet returned by `getData()` gets automatically assigned as `data` in the route context object and is accessible from `getMeta()` and `onEnter()` hooks and also via the `useRouteContext()` hook.

</td>
<td width="600px"><br>

```jsx
import { useRouteContext } from '/dx:context'

export function getData () {
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

## General isomorphic operations

<table>
<tr>
<td width="400px" valign="top">

### `onEnter()`

If a route module exports a `onEnter()` function, it's executed 

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

This example is part of the starter boilerplate.

</td>
</tr>
</table>

## Route Context

<table>
<tr>
<td width="400px" valign="top">

### `useRouteContext()`

</td>
<td width="600px"><br>

```jsx
import { useRouteContext } from '/dx:context'
  
export function 
export function Index () {
  const { data } = useRouteContext()
  return <p>{data.message}</p>
}
```

This example is part of the starter boilerplate.

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

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:mount`

</td>
<td width="600px"><br>

```js
import create from '/dx:base.jsx'
import routes from '/dx:routes'

mount('main', { create, routes })
```

[See the full file]() for the `mount()` function definition.

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

See the full file for the `createRoutes()` and `hydrateRoutes()` definitions. If you want to use your own custom routes list, just replace the glob imports with your own routes list:

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

</td>
<td width="600px"><br>


</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:context.jsx`

</td>
<td width="600px"><br>


</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:resource`

</td>
<td width="600px"><br>


</td>
</tr>
</table>
