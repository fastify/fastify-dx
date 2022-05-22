# The Universal Route Module API Specification

This document contains the proposed specification for a standard **Route Module API** frameworks could adopt to improve code portability and reduce vendor lock-in. This specification is heavily inspired by Remix's Route Module API. 

In some ways it can be considered a superset of it, but there are some key differences. 

## Introduction

The late 2010s saw the dawn of the age of the **SSR framework**. Since **server-side rendering** (SSR) is just [too complex and often requires a great deal of preparation](https://hire.jonasgalvez.com.br/2022/apr/30/a-gentle-introduction-to-ssr/) to get right — starting from the fact that people (to this date!) [still disagree](https://news.ycombinator.com/item?id=31224226) on what SSR actually is<sup>**[1]**</sup>, specialized frameworks started appearing to meet the inevitable demand for tools that spared developers of the boilerplate work and let them jump straight into their application code, without caring for underlying implementation details. 

> **[1]** SSR in this context refers to the server-side rendering **of client-side JavaScript** to produce on the server the same markup that is dynamically rendered by browser, so client-side JavaScript doesn't have to spend time rendering the same fragment twice.

First came [Next.js](https://nextjs.org/) (React) and [Nuxt.js](https://nuxtjs.org/) (Vue) back in 2016, and in recent times, [SvelteKit](https://kit.svelte.dev/) (Svelte) and [Remix](https://remix.run/) (React). There are many others, but presently these are the ones that have amassed the largest user bases. Between 2018 and 2020 I was a core contributor to Nuxt.js and acquired a deep understanding of the complexities and challenges involved. 

It also ocurred to me that for optimal performance, safety and flexibility, frameworks [would be better off](https://hire.jonasgalvez.com.br/2022/may/02/the-thing-about-fastify/) building on top of [Fastify](https://fastify.io/) rather than trying to incorporate their own backend mechanics with built-in Express-like servers. That's when I started working on [fastify-vite](https://github.com/fastify/fastify-vite), a Fastify plugin to integrate with [Vite](https://vitejs.dev/)-bundled client applications. At least Nuxt.js and SvelteKit seem to agree that building on top of Vite is a good idea — the Vite ecosystem is a solid base for addressing a lot of core, foundational aspects of frameworks, not only bringing a lot of flexibility to the build process (through Vite plugins), but also providing developer experience features such as **hot module reload**.

After many iterations, [fastify-vite]() evolved to become a highly configurable approach for integrating Vite within Fastify applications. Focusing now on architectural primitives, such as dependency injection and route registration, it's conceivably feasible to reimplement any framework with it. To demonstrate this level of flexibility, I [reimplemented two Next.js essential features for both React and Vue](https://hire.jonasgalvez.com.br/2022/may/18/building-a-mini-next-js/).

> “Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it. And to make matters worse: complexity sells better.” ― Edsger W. Dijkstra

The one thing **[fastify-vite](https://github.com/fastify/fastify-vite)** doesn't do is provide an API out of the box for how route modules can control HTML shell, rendering and data fetching aspects of an individual web page. It provides you with an API to implement your own.

That's where [Fastify DX]() comes in, but instead of reinventing the wheel like every other framework once again, I decided to spend time reviewing all existing APIs, to figure out if any of them would be worth incorporating into an actual **standard specification**.

## Problem

The problem this specification tries to solve is how to determine the behaviour of web pages that can be both **server-side rendered** and (continuosly) **client-side rendered** in an uniform way. It tries to answer these questions:

- How to determine the **rendering mode** and **rendering settings** of a web page.
- How to implement `<head>` tags, HTML `<body>` and `<html>` attributes of a web page, both for **SSR** and **CSR route navigation**.
- How to implement a **data loading function** for a web page, both for **SSR** and **CSR route navigation**.
- How to implement **static data payloads** for web pages being **statically generated**.

All aforementioned frameworks have different answers to these questions. There's a great opportunity for standardization in this area that would improve **code portability** across frameworks, help make underlying patterns **more transparent** and let framework authors focus on enhancing developer experience in upward layers where **more value** can be provided.

## Solution

Framework route components are typically loaded as JavaScript modules, where the actual component instance is conventionally exposed through the `default` export. Frameworks can leverage route component JavaScript modules to collect other properties from a route component module, as has been made widely popular by [Next.js](https://nextjs.org/) and its [data fetching function exports](https://nextjs.org/docs/basic-features/data-fetching/overview).

I belive Remix laid substantial groundwork for a generic API specifying several route module core functionalities. This specification builds on top of it, expanding on it and trying to fill in the gaps, and offering some subtle modifications as well.

For a React route component, here's how a route module might be defined:

```jsx
export const stream = true
export const ssrOnly = true

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

export default function Route () {
  return (
    <>
      <h1>Route</h1>
      <p>Route text</p>
    </>
  )
}
```


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
  
If the function returns an object, its properties should be merged into the passed route context under a `data` property.

</td>
<td width="600px"><br>

```js
export async function handler ({ reply ) {
  reply.header('X-Custom-Header', 'value')
}
```

</td>
</tr>
</table>


<table>
<tr>
<td width="400px" valign="top">

## `payload`

Determines the **static data payload** for the route.

</td>
<td width="600px"><br>

```js
export async function handler (context) {
  const url = context.req
}
```

</td>
</tr>
</table>


<table>
<tr>
<td width="400px" valign="top">

## `loader`

Determines the **server data function** for the route. It must be implemented in way that it can run both on the server prior to **server-side rendering** and through an endpoint that can be fetched prior to **client-side route navigation**.

</td>
<td width="600px"><br>

```js
export async function loader (context) {
  const url = context.req
  const data = await context.dataReturningFunction()
  return { data }
}
```

</td>
</tr>
</table>


<table>
<tr>
<td width="400px" valign="top">

## `action`

An alternative to `handler` as a shortcut to exclusively handle HTTP `POST`, `PUT` and `PATCH` requests.

</td>
<td width="600px"><br>

```js
export async function action (context) {
  // ...
}
```
  

</td>
</tr>
</table>

## Named Exports: Page Metadata


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

## `links`

A shortcut for specifying a list of `Link` objects, which can also be specified by the `link` property in the `page` return object. These `Link` objects simply represent HTML `<link>` tags, where each property gets serialized as an attribute.

</td>
<td width="600px"><br>

```js
export async function links (context) {
  return [
      { rel: 'stylesheet', href: '... }
    ]
  }
}
```

</td>
</tr>
</table>


## The Universal Context

In the case of **named function exports**, a `context` object must be passed to the function, providng access to server methods. It must contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.
