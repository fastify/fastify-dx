# The Universal Component Interface


...


## Named Exports: Data and Hydration


<table>
<tr>
<td width="50%" valign="top">

## `payload`

Determines the server **data payload** for the component. It must be provided as a function and it must be implemented in way that it can run both on the server prior to **server-side rendering** and through an endpoint that can be fetched prior to **client-side route navigation**.

A `context` object must be passed to the function, providng access to server methods. It must contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.

</td>
<td width="50%"><br>

```js
export async function payload (context) {
  const url = context.req
  const data = await context.someDataReturningFunction()
  return { data }
}
```
  

</td>
</tr>
</table>


<table>
<tr>
<td width="50%" valign="top">

## `data`

Determines the server **data payload** for the component. It must be provided as a function and it must be implemented in way that it can run both on the server prior to **server-side rendering** and through an endpoint that can be fetched prior to **client-side route navigation**.

A `context` object must be passed to the function, providng access to server methods. It must contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.

</td>
<td width="50%"><br>

```js
export async function data (context) {
  const url = context.req
  const data = await context.someDataReturningFunction()
  return { data }
}
```
  

</td>
</tr>
</table>


<table>
<tr>
<td width="50%" valign="top">

## `hydration`

Determines the server **data payload** for the component. It must be provided as a function and it must be implemented in way that it can run both on the server prior to **server-side rendering** and through an endpoint that can be fetched prior to **client-side route navigation**.

A `context` object must be passed to the function, providng access to server methods. It must contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.

</td>
<td width="50%"><br>

```js
export async function hydration (context) {
  const url = context.req
  const data = await context.someDataReturningFunction()
  return { data }
}
```
</td>
</tr>
</table>

## Named Exports: Rendering Modes


<table>
<tr>
<td width="50%" valign="top">

## `payload`

Determines the server **data payload** for the component. It must be provided as a function and it must be implemented in way that it can run both on the server prior to **server-side rendering** and through an endpoint that can be fetched prior to **client-side route navigation**.

A `context` object must be passed to the function, providng access to server methods. It must contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.

</td>
<td width="50%"><br>

```js
export async function payload (context) {
  const url = context.req
  const data = await context.someDataReturningFunction()
  return { data }
}
```
  

</td>
</tr>
</table>


<table>
<tr>
<td width="50%" valign="top">

## `payload`

Determines the server **data payload** for the component. It must be provided as a function and it must be implemented in way that it can run both on the server prior to **server-side rendering** and through an endpoint that can be fetched prior to **client-side route navigation**.

A `context` object must be passed to the function, providng access to server methods. It must contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.

</td>
<td width="50%"><br>

```js
export async function payload (context) {
  const url = context.req
  const data = await context.someDataReturningFunction()
  return { data }
}
```
  

</td>
</tr>
</table>


<table>
<tr>
<td width="50%" valign="top">

## `payload`

Determines the server **data payload** for the component. It must be provided as a function and it must be implemented in way that it can run both on the server prior to **server-side rendering** and through an endpoint that can be fetched prior to **client-side route navigation**.

A `context` object must be passed to the function, providng access to server methods. It must contain references to the Request and Response objects following the convention and semantics of the underlying server used. In the case of Fastify, those would be `req` and `reply`.

</td>
<td width="50%"><br>

```js
export async function payload (context) {
  const url = context.req
  const data = await context.someDataReturningFunction()
  return { data }
}
```
  

</td>
</tr>
</table>
