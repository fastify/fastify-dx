# The Universal Route Module API Specification

This document contains the proposed specification for a standard **Route Module API** frameworks could adopt to improve code portability and reduce vendor lock-in. This specification is heavily inspired by Remix's [**Route Module API**](https://remix.run/docs/en/v1/api/conventions#route-module-api). 

## Status

This is a **living document** in its earliest stage — a lot of things might still change as we develop **Fastify DX** and following the feedback of all interested parties (e.g., other framework authors willing to collaborate).

As it stands, this API can be described with the following TypeScript interfaces:

```ts
interface RouteMeta {
  title: string | null, 
  html: Record<string, string> | null
  body: Record<string, string> | null
  meta: Record<string, string>[] | null,
  link: Record<string, string>[] | null,
}

interface RouteContext {
  readonly url: string
  readonly static: boolean
  readonly server: boolean
  readonly client: boolean
  fetch: () => Promise<Response>
  reload: () => Promise<Response>
  meta?: RouteMeta
  data?: any
}

interface RouteModule {
  generated?: boolean
  streaming?: boolean
  clientOnly?: boolean
  serverOnly?: boolean
  onRequest?: (context: RouteContext) => void | Promise<void>
  onEnter?: (context: RouteContext) => void | Promise<void>
  onLeave?: (context: RouteContext) => void | Promise<void>
  getData?: (context: RouteContext) => any | Promise<any>
  getMeta?: (context: RouteContext) => RouteMeta | Promise<RouteMeta>
}
```

## Problem

The problem this specification tries to solve is how to determine the behaviour of web pages that can be both **server-side rendered** and (continuosly) **client-side rendered** in an uniform way. It tries to answer these questions:

- How to determine the **rendering mode** and **rendering settings** of a web page.
- How to implement `<head>` tags, HTML `<body>` and `<html>` attributes of a web page, both for **SSR** and **CSR route navigation**.
- How to implement a **data loading function** for a web page, both for **SSR** and **CSR route navigation**.
- How to implement **static data payloads** for web pages being **statically generated**.

All existing frameworks have different answers to these questions. There's a great opportunity for standardization in this area that would improve **code portability** across frameworks, help make underlying patterns **more transparent** and let framework authors focus on enhancing developer experience in upward layers where **more value** can be provided.

## Solution

Framework route components are typically loaded as JavaScript modules, where the actual component instance is conventionally exposed through the `default` export. Frameworks can leverage route component JavaScript modules to collect other properties, as has been made widely popular by [Next.js](https://nextjs.org/) and its [data fetching function exports](https://nextjs.org/docs/basic-features/data-fetching/overview).

I belive Remix laid substantial groundwork for a generic API specifying several route module core functionalities. This specification builds on top of it, expanding on it and trying to fill in the gaps, and offering some subtle modifications as well.

<table>
<tr>
<td width="400px" valign="top">

### An hypothetical React component

For a React route component running in an hypothetical framework that implements this specification, here's what it might look like.
 
At the top, we enable `stream` to determine that this route should  be server-side rendered in streaming mode. 

Then the `getData()` function, which should run both in SSR and CSR route navigation. It is assumed this function received a **route context object**, and in this case, a generic `route` object is also provided by the framework to identify the current route. 

The `getMeta()` function runs after `getData()` and has access to the data returned by it via the `data` property. It's used to define the `<title>` of the page and other page-level tags. Finally the route component function is executed, which in this case, has a data property prepopulated by the underlying hypothetical framework.

</td>
<td width="600px"><br>

```jsx
export const streaming = true

export async function getData ({ route, loadPageData }) {
  const pageData = await loadPageData(route)
  return pageData
}

export async function getMeta ({ data }) {
  return {
    html: { lang: data.lang },
    title: data.title,
    meta: [
      { name: 'twitter:title', value: data.title }
    ]
  }
}

export default function Route ({ data }) {
  return (
    <>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </>
  )
}
```

</td>
</tr>
</table>

## Route Context Object

<table>
<tr>
<td width="400px" valign="top">

### `context`

In the case of **named function exports**, a `context` object must be passed to the function, providing universal access to route information, data and methods. See the TypeScript interface to the right for a minimal implementation.
 
If the route context contains a `data` object, it must be made available during SSR (seamlessly hydrated on first-render) and CSR.
 
It may contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.

</td>
<td width="600px"><br>

It must implement at least the following TypeScript interface:

```ts
interface RouteContext {
  readonly url: string
  readonly static: boolean
  readonly server: boolean
  readonly client: boolean
  fetch: () => Promise<Response>
  reload: () => Promise<Response>
  meta?: RouteMeta
  data?: any
}
```

</td>
</tr>
</table>

## Named Exports: Rendering Options

By default, route modules **should** run universally, both on the server and on the client (with client-side hydration), but it **should** be possible specify different rendering modes or settings for a route module.

<table>
<tr>
<td width="400px" valign="top">

### `streaming`

Determines if **server-side rendering** should take place in **streaming mode** if the underlying framework supports it.

</td>
<td width="600px"><br>

It must be set with a `boolean`:

```js
export const streaming = true
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `serverOnly`

Determines that the component must only run on the server and no JavaScript code should run on the client, i.e., the client should receive the **static markup** produced by running the component on the server, making it effectively [SSR](https://web.dev/rendering-on-the-web/#server-rendering)-only). 

</td>
<td width="600px"><br>

It must be either set with a `boolean`:

```js
export const serverOnly = true
```
  
Or with a function that returns a `boolean`:
  
```js
export function serverOnly (context) {
  return context.shouldRunOnlyOnTheServer
}
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `clientOnly`

Determines that the component must only run on the client and no **server-side rendering** is to take splace, i.e., the client should perform rendering entirely on its own ([CSR](https://web.dev/rendering-on-the-web/#client-side-rendering-(csr))-only). It may either be a `boolean` or a function that returns a `boolean`.

</td>
<td width="600px"><br>

It must be either set with a `boolean`:

```js
export const clientOnly = true
```
  
Or with a function that returns a `boolean`:
  
```js
export function clientOnly (context) {
  return context.shouldRunOnlyOnTheClient
}
```

</td>
</tr>
</table>

## Named Exports: Route Navigation and Hydration

<table>
<tr>
<td width="400px" valign="top">

## `onEnter()`

Determines the universal **route handler** for the component. It must be implemented in way that it can run both on the server prior to **server-side rendering** and on the client prior to **client-side route navigation** (via **History API**). 
  
It **must** receive a route context object that **should** receive server request and response references during SSR and a client-side router reference during CSR, or hybrid APIs that can work in both environments.

</td>
<td width="600px"><br>

```js
export async function onEnter ({ reply, isServer }) {
  if (isServer) {
    // This runs on the server where you have access, 
    // for instance, to the Fastify Reply object
    reply.header('X-Custom-Header', 'value')
  } else {
    console.log('This should only appear in the browser')
  }
}
```
 
> This function could be used to reimplement `useAsyncData()` in Nuxt.js and `action()` in Remix.js.

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

## `getData()`

Determines the **server data function** for the route. It must be implemented in way that it can run both on the server prior to **server-side rendering** and **through an endpoint that can be fetched** prior to **client-side route navigation**. This function is expected to return an object, whose properties should be merged into the passed route context under a `data` property, which should be also seamlessly hydrated on first-render if populated during SSR. In the case of **static generation**, its return value should be embedded within each page as an inline `<script>`.

</td>
<td width="600px"><br>

```js
export async function getData (context) {
  const url = context.req
  const data = await context.dataReturningFunction()
  return { data }
}
```
 
> This function could be used to reimplement `gerServerSideProps()` in Next.js,  `load()` in SvelteKit and `loader()` in Remix.

</td>
</tr>
</table>

## Named Exports: Page Metadata

This specification recommends that `<head>` serialization (and other page-level tags) take place indepedently from SSR, for optimal performance and opening the possibility of delivering an application shell for CSR-only rendering. SSR may still yield additional `<link>` preload tags for dynamic component assets, but that should happen isolatedly from the main page metadata so the ability to stream it right away to the client is preserved.

<table width="100%">
<tr>
<td width="400px" valign="top">

## `getMeta()`

Determines HTML tags such as `<title>`, `<meta>` and `<link>`, as well as `<html>` and `<body>` tag attributes. It must be set either with an object or a function that returns an object described by the `RouteMeta` interface.
  
</td>
<td width="600px"><br>

```js
export async function getMeta (context) {
  const title = context.post.title
  return {
    title: 'Page title',
    html: { lang: 'en' },
    meta: [
      { name: 'twitter:title', content: title }
    ]
  }
}
```

</td>
</tr>
</table>


## Acknowledgements

Special thanks to my employeer, [NearForm](https://nearform.com), for sponsoring this project, and [Matteo Collina](https://github.com/mcollina) and [Simone Busoli](https://github.com/simoneb) for their honest feedback and guidance. Also a big shout out to [Sébastien Chopin](https://github.com/Atinux), [Pooya Parsa](https://github.com/pi0) and [Xin Du](https://github.com/clarkdo) from Nuxt.js — who I learned a lot from.

This specification owes a lot to [Ryan Florence](https://github.com/ryanflorence) and [Michael Jackson](https://github.com/mjackson) for their time spent designing Remix and coming up with an excellent Route Module API for their framework. [Guillermo Rauch](https://github.com/rauchg) and [Tim Neutkens](https://github.com/timneutkens) also need to be ackowledged for their work in Next.js which helped shape up a lot of the developer experience we've come to expect from modern frameworks.
