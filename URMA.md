# The Universal Route Module API Specification

This document contains the proposed specification for a standard **Route Module API** frameworks could adopt to improve code portability and reduce vendor lock-in. This specification is heavily inspired by Remix's [**Route Module API**](https://remix.run/docs/en/v1/api/conventions#route-module-api). 

In some ways it can be considered a superset of it, but there are some key differences. 

## Status

This is a **living document** in its earliest stage — a lot of things might still change as we develop **Fastify DX** and following the feedback of all interested parties (e.g., other framework authors willing to collaborate).

## Problem

The problem this specification tries to solve is how to determine the behaviour of web pages that can be both **server-side rendered** and (continuosly) **client-side rendered** in an uniform way. It tries to answer these questions:

- How to determine the **rendering mode** and **rendering settings** of a web page.
- How to implement `<head>` tags, HTML `<body>` and `<html>` attributes of a web page, both for **SSR** and **CSR route navigation**.
- How to implement a **data loading function** for a web page, both for **SSR** and **CSR route navigation**.
- How to implement **static data payloads** for web pages being **statically generated**.

All aforementioned frameworks have different answers to these questions. There's a great opportunity for standardization in this area that would improve **code portability** across frameworks, help make underlying patterns **more transparent** and let framework authors focus on enhancing developer experience in upward layers where **more value** can be provided.

## Solution

Framework route components are typically loaded as JavaScript modules, where the actual component instance is conventionally exposed through the `default` export. Frameworks can leverage route component JavaScript modules to collect other properties, as has been made widely popular by [Next.js](https://nextjs.org/) and its [data fetching function exports](https://nextjs.org/docs/basic-features/data-fetching/overview).

I belive Remix laid substantial groundwork for a generic API specifying several route module core functionalities. This specification builds on top of it, expanding on it and trying to fill in the gaps, and offering some subtle modifications as well.

<table>
<tr>
<td width="400px" valign="top">

### An hypothetical React component

For a React route component running in an hypothetical framework that implements this specification, here's what it might look like.
 
At the top, we enable `stream` to determine that this route should  be server-side rendered in streaming mode. 

Then the `loader()` function, which should run both in SSR and CSR route navigation. It is assumed this function received a **route context object**, and in this case, a generic `route` object is also provided by the framework to identify the current route. 

The `page()` function runs after `loader()` and has access to the data returned by it via the `data` property. It's used to define the `<title>` of the page and other page-level tags. Finally the route component function is executed, which in this case, has a data property prepopulated by the underlying hypothetical framework.

</td>
<td width="600px"><br>

```jsx
export const stream = true

export async function loader ({ route, loadPageData ) {
  const pageData = await loadPageData(route)
  return pageData
}

export async function page ({ data }) {
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
  // Convenience reference to the route URL
  url: string
  // Whether or not code is running on the server
  ssr: boolean
  // Universally executable `fetch()` function
  fetch: () => any
  // Where to store data returned by the payload() function
  payload: object | any[]
  // Where to store data returned by the loader() function
  data: object | any[]
}
```

Here's the interface planned for **Fastify DX**:

```ts
interface RouteContext {
  url: string
  ssr: boolean
  fetch: () => any
  payload: object | any[]
  data: object | any[]
  // Convenience accessors
  query: Record<string, string>
  params: Record<string, string>
  // Only available during SSR
  req?: FastifyRequest,
  reply?: FastifyReply,
  server?: FastifyInstance,
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

### `stream`

Determines if **server-side rendering** should take place in **streaming mode** if the underlying framework supports it.

</td>
<td width="600px"><br>

It must be set with a `boolean`:

```js
export const stream = true
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `ssrOnly`

Determines that the component must only run on the server and no JavaScript code should run on the client, i.e., the client should receive the **static markup** produced by running the component on the server, making it effectively [SSR](https://web.dev/rendering-on-the-web/#server-rendering)-only). 

</td>
<td width="600px"><br>

It must be either set with a `boolean`:

```js
export const ssrOnly = true
```
  
Or with a function that returns a `boolean`:
  
```js
export function ssrOnly (context) {
  return context.shouldRunOnlyOnTheServer
}
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `csrOnly`

Determines that the compone must only run on the client and no **server-side rendering** is to take splace, i.e., the client should perform rendering entirely on its own ([CSR](https://web.dev/rendering-on-the-web/#client-side-rendering-(csr))-only). It may either be a `boolean` or a function that returns a `boolean`.

</td>
<td width="600px"><br>

It must be either set with a `boolean`:

```js
export const csrOnly = true
```
  
Or with a function that returns a `boolean`:
  
```js
export function csrOnly (context) {
  return context.shouldRunOnlyOnTheClient
}
```

</td>
</tr>
</table>

## Named Exports: Data and Hydration


<table>
<tr>
<td width="400px" valign="top">

## `handler`

Determines the universal **route handler** for the component. It must be implemented in way that it can run both on the server prior to **server-side rendering** and on the client prior to **client-side route navigation** (via **History API**). 
  
It **must** receive a route context object that **should** receive server request and response references during SSR and a client-side router reference during CSR, or hybrid APIs that can work in both environments. 
  
If the function returns an object, its properties should be merged into the passed route context under a `data` property, which should be seamlessly hydrated on first-render if populated during SSR.

</td>
<td width="600px"><br>

```js
export async function handler ({ reply, isServer ) {
  if (isServer) {
    // This runs on the server where you have access, 
    // for instance, to the Fastify Reply object
    reply.header('X-Custom-Header', 'value')
  } else {
    console.log('This should only appear in the browser')
  }
}
```
 
> This function could be used to reimplement `useAsyncData()` in Nuxt.js.

</td>
</tr>
</table>


<table>
<tr>
<td width="400px" valign="top">

## `loader`

Determines the **server data function** for the route. It must be implemented in way that it can run both on the server prior to **server-side rendering** and **through an endpoint that can be fetched** prior to **client-side route navigation**.

</td>
<td width="600px"><br>

```js
export async function loader (context) {
  const url = context.req
  const data = await context.dataReturningFunction()
  return { data }
}
```
 
> This function could be used to reimplement `gerServerSideProps()` in Next.js,  `load()` in SvelteKit and `loader()` and `action()` in Remix.

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

## `payload`

Determines the **static data payload** for the route. The result of this function should be made available as `payload` in the route context object, and embedded within each page as an inline script after **static generation**.

</td>
<td width="600px"><br>

```js
export async function payload (context) {
  // ...
}
```
 
 > This function could be used to reimplement `getStaticProps()` in Next.js.

</td>
</tr>
</table>

## Named Exports: Page Metadata

This specification recommends that `<head>` serialization (and other page-level tags) take place indepedently from SSR, for optimal performance and opening the possibility of delivering an application shell for CSR-only rendering. SSR may still yield additional `<link>` preload tags for dynamic component assets, but that should happen isolatedly from the main page metadata so the ability to stream it right away to the client is preserved.

<table width="100%">
<tr>
<td width="400px" valign="top">

## `page`

Determines HTML tags such as `<title>`, `<meta>` and `<link>`, as well as `<html>` and `<body>` tag attributes. It must be set either with an object or a function that returns an object described by the following TypeScript interface:
  
```js
interface Page {
  meta: Meta[];
  link: Link[];
  title: string;
  html: object;
  body: object;
}
```
  
</td>
<td width="600px"><br>

```js
export async function page (context) {
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

<table width="100%">
<tr>
<td width="400px" valign="top">

## `meta`

A shortcut for specifying a list of `Meta` objects, which can also be specified by the `meta` property in the `page` return object. These `Meta` objects simply represent HTML `<meta>` tags, where each property gets serialized as an attribute.


</td>
<td width="600px"><br>

```js
export async function meta (context) {
  return [
      { name: 'twitter:title', content: title }
    ]
  }
}
```

</td>
</tr>
</table>


<table width="100%">
<tr>
<td width="400px" valign="top">

## `link`

A shortcut for specifying a list of `Link` objects, which can also be specified by the `link` property in the `page` return object. These `Link` objects simply represent HTML `<link>` tags, where each property gets serialized as an attribute.

</td>
<td width="600px"><br>

```js
export async function link (context) {
  return [
      { rel: 'stylesheet', href: '... }
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
