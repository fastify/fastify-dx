# The Universal Component Interface

...

## Named Exports: Rendering Modes

By default, components **should** run universally, both on the server and on the client (with client-side hydration), but component authors **may** specify different rendering modes for a component.

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

Determines that the compone must only run on the client and no **server-side rendering** is to take splace, i.e., the client should perform rendering entirely on its own ([CSR](https://web.dev/rendering-on-the-web/#client-side-rendering-(csr))-only). It may either be a `boolean` or a function that returns a `boolean`.

</td>
<td width="600px"><br>

```js
export const clientOnly = true
```
  
```js
export function clientOnly (context) {
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

## `payload`

Determines the server **data payload** for the component. It must be provided as a function and it must be implemented in way that it can run both on the server prior to **server-side rendering** and through an endpoint that can be fetched prior to **client-side route navigation**.

A `context` object must be passed to the function, providng access to server methods. It must contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.

</td>
<td width="600px"><br>

```js
export async function payload (context) {
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

## `data`

Determines the <u>**universal**</u> **data payload** for the component. It must be provided as a function and it must be implemented in way that it can run both on the server prior to **server-side rendering** and on the client prior to **client-side route navigation**.

</td>
<td width="400px"><br>

```js
export async function data (context) {
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

## `hydration`

Determines the server **data payload** for the component. It must be provided as a function and it must be implemented in way that it can run both on the server prior to **server-side rendering** and through an endpoint that can be fetched prior to **client-side route navigation**.

A `context` object must be passed to the function, providng access to server methods. It must contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.

</td>
<td width="400px"><br>

```js
export async function hydration (context) {
  const url = context.req
  const data = await context.dataReturningFunction()
  return { data }
}
```
</td>
</tr>
</table>

## Named Exports: Head Tag


<table width="100%">
<tr>
<td width="400px" valign="top">

## `head`

Determines the server **data payload** for the component. It must be provided as a function and it must be implemented in way that it can run both on the server prior to **server-side rendering** and through an endpoint that can be fetched prior to **client-side route navigation**.

A `context` object must be passed to the function, providng access to server methods. It must contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.

</td>
<td width="400px"><br>

```js
export async function head (context) {
  const title = context.post.title
  return {
    title,
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

A shortcut for defining the same `meta` property that can be returned by `head`.

</td>
<td width="400px"><br>

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

## `meta`

A shortcut for defining the same `meta` property that can be returned by `head`.

</td>
<td width="400px"><br>

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


## The Universal Context

In the case of **named function exports**, a `context` object must be passed to the function, providng access to server methods. It must contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.
