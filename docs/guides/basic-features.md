
<table>
<tr>
<td width="300px" valign="top">

<h2>

**Smart**

</h2>

Fastify DX lets you configure your application through module exports. It will recognize several types of exports, like the ones seen in the previous example. 

It supports everything [**`fastify-apply`**]() supports, making it easy to set Fastify hooks and decorators. It also maps certain exports to plugin registrations, i.e., a `jwt` export will be used to register and define settings for `fastify-jwt`. 

Additionally, an `env` function export will be used to generate `env-schema` settings to setup the environment safely. An instance of `fluent-json-schema` is passed to the function.

See the full list of recognized exports at the end of this page.

</td>
<td><br>

The server init file, `server.js`, is where you configure your server settings, plugins and additional routes.

```js
// Override built-in Fastify(settings)
export const server = {
  disableRequestLogging: false,
}

// Passed to fastify.listen()
export const port = 8000
export const host = 'dev.domain.local'

export default (app) => {
  // Register other routes and plugins as usual
  app.get('/', (req, reply) => {
    reply.send('Hello world!')
  })
}
```

More application configuration through exportables. In the example below we configure `fastify-jwt`, the environment settings. We also define a `Reply` [decorator]() and an `onRequest` [hook]().

```js
// Sets up fastify-jwt
export const jwt = { secret: 'super secret' }

// Sets up env-schema with fluent-json-schema
export const env = S => ({
  schema: S
    .object()
    .prop('PORT', S.number().default(3000).required()),
  dotenv: true,
})

// Same as app.addHook('onRequest', ...)
export function onRequest (req, _, done) {
  req.log.info('Got a request!')
  done()
}

// Same as app.decorateReply('sendHello', ...)
export const decorateReply = {
  sendHello () {
    this.send({ message: 'Hello world!' })
  },
}

export default (app) => {
  app.get('/api/hello', (req, reply) => {
    reply.sendHello()
  })
}
```

</td>
</tr>
</table>


<table>
<tr>
<td width="300px" valign="top">

<h2>

**SSR-ready**

</h2>

Fastify DX leverages [**`fastify-vite`**]() to integrate seamlessly with [**Vite**](https://vitejs.dev/) and use it to bundle frontend code and make it available for server-side rendering (SSR). It also includes commands which should be familiar from other frameworks:

`dx build` creates the production bundle (saved to `dist/` by default).

`dx generate` is the same as `dx build` but also prerenders all static routes or predefined routes through configuration.

SSR is a huge topic that we try to cover in these individual guides:


</td>
<td valign="top"><br>

Fastify DX chooses **Vue 3** as the flagship frontend framework for its [**`fastify-vite`**]() integration. Support comes from the [**`fastify-vite-vue`**]() package. 

It will automatically set up an individual route for every Vue file it finds that containts a `route` export:

```vue
<template>
  <h1>Hello world</td>
</template>

<script>
export const route = '/'
</script>
```

In **development mode**, the integrated **Vite** server will take care of relaying changes in frontend code instantly to the browser. It's also smart about when to hot reload your app completely (restart the server) or just let Vite handle it.

Support for other frontend frameworks is also coming!

</td>
</tr>
</table>

<table>
<tr>
<td width="300px" valign="top">

<h2>

**Small**

</h2>

Everything's under 700 lines of code.

For reference, **Nuxt.js** has 15k, **Next.js** has 129k and **Remix** has 16k. 

**Fastify DX** is able to stay small by fully leveraging [Fastify](https://github.com/fastify/fastify) and [fastify-vite](https://github.com/fastify/fastify-vite) for its SSR and frontend functionalities. Both are also small on their own (4.4k and 1.1k).

Its use of [**zx**](https://github.com/google/zx) also helps to simplify a lot of the complexity in the CLI and hot reload setup. Fastify DX doesn't use forking for hot reloading.

</td>
<td>

<br>Fastify DX has an **absolutely minimal core**.

`index.mjs` is the CLI entry point, when you run `dx` on the command-line. This is a [`zx`](https://github.com/google/zx)-powered script that will load your application with **hot reload** enabled if you run `dx dev your-app`, or just load `listen.mjs` straight away if booting in production mode.

`logger.mjs` is the logger for **development mode**, it collects Fastify logs from the main process and prints them in the most concise and friendly way possible.

`listen.mjs` is the actual application entry point, the one that sets up a **Fastify** server instance and starts listening.

`server.mjs` is where the **Fastify** server instance gets sets up, all configurations options loaded and plugins registered. It exports `setup()` and `listen()` functions.

**That's it**. You can also **eject** all of the above into your codebase for maximum customization.
</td>
</tr>
</table>
