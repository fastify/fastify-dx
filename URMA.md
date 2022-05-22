# The Universal Route Module API Specification

The late 2020s saw the dawn of the age of the **SSR framework**. Since **server-side rendering** (SSR) is just [too complex and often requires a great deal of preparation](https://hire.jonasgalvez.com.br/2022/apr/30/a-gentle-introduction-to-ssr/) to get right, specialized frameworks started appearing to meet the inevitable demand for tools that spared developers of the boilerplate work and let them jump straight into their application, without caring for underlying implementation details. 

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
