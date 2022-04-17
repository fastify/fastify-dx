
<table>
<tr>
<td width="300px" valign="top">

<h2>

**Scalable**

</h2>

Addressing performance and scalability issues with SSR is one of Fastify DX's main goals. To that end, **multi-threaded SSR** based on [**Piscina**]() is offered out of the box.

SSR can become a bottleneck under high load, so you also have the ability to **turn off** SSR altogether on a per-request basis and **fallback to CSR** when necessary.

</td>
<td valign="top"><br>

To achieve maximum SSR performance, enable multi-threaded SSR by exporting `multiThreadedSSR` from your Fastify DX application:

```js
export const multiThreadedSSR = true
```

Sensible settings are passed under the hood to a **SSR worker pool** based on [**Piscina**](https://github.com/piscinajs/piscina). These settings can be customized if you pass a [configuration object]() instead.

You can easily **disable SSR** and fallback to CSR as well, by leveraging [**`under-pressure`**]() and [**`fastify-vite`**]()'s `req.fallbackToCSR()`. 

In your Fastify DX application file:

```js
export const underPressure = {
  maxHeapUsedBytes: 100000000,
  maxRssBytes: 100000000,
  pressureHandler: (req, reply) => {
    req.fallbackToCSR()
  }
}
```

Support for other frontend frameworks is also coming!

</td>
</tr>
</table>

