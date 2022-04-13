<br><br>

<img width="70%" alt="Fastify DX" src="https://user-images.githubusercontent.com/12291/163095704-d1bd8541-ecde-4707-8068-17d2fd725c01.svg">

A minimal full stack framework based on Fastify focused on **Developer eXperience**.

⚡️ Minimally opinionated [**Vue 3**](https://vuejs.org/) support out of the box, with **CSR**, **SSR** and **SSG** available.

📦 Prepacks optimal Fastify server setup with [**fastify-sensible**]() and other essential plugins.

🔥 Written in **native ESM** and makes use of **modern Node.js APIs** (v16+).

<table>
<tr>
<td width="300px" valign="top">

<h2>

**Easy**

</h2>

First, install the CLI globally:

```bash
% npm i dx -g
```

Then start a new project:

```bash
% dx setup <dir>
% cd <dir>
```

**Hot reload** and **friendly logs**:

```bash
% dx dev app.mjs
```

**Production mode**:

```bash
% dx app.mjs
```

</td>
<td valign="top"><br>

Fastify DX is incredibly easy to use. Running `dx setup` gets you 4 files: `app.mjs`, `index.vue`, `vite.config.mjs` and `package.json`, with all dependencies automatically installed.

Your application file — say, `app.mjs`, is where you configure your server settings, plugins and additional routes.

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

</td>
</tr>
</table>

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

🗒 [**Effective SSR Development**]()
<br>🗒 [**Isomorphic Data Fetching**]()

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

<br><br>

# Reference

<table>
<tr>
<td>

<h2>

**Basics**

</h2>

These are the basic settings which can be exported from your Fastify DX application file.

<table>
<thead>
<tr>
<th>Property</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>server</td>
<td>Settings passed to the Fastify constructor</td>
</tr>
<tr>
<td>port</td>
<td>The port the Fastify server will listen on</td>
</tr>
<tr>
<td>host</td>
<td>The host the Fastify server will bind to</td>
</tr>
</tbody>
</table>

</td>
</tr>
</table>


<table>
<tr>
<td>

<h2>

**Plugins**

</h2>

Plugins recognized by Fastify DX through shorthand exportables:

<table width="900px">
<thead>
<tr>
<th>Exportable</th>
<th>Plugin</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>accepts</td>
<td>fastify-accepts</td>
<td>...</td>
</tr>
<tr>
<td>csrf</td>
<td>fastify-csrf</td>
<td>...</td>
</tr>
<tr>
<td>cors</td>
<td>fastify-cors</td>
<td>...</td>
</tr>
<tr>
<td>cookie</td>
<td>fastify-cookie</td>
<td>...</td>
</tr>
<tr>
<td>compress</td>
<td>fastify-compress</td>
<td>...</td>
</tr>
<tr>
<td>helmet</td>
<td>fastify-helmet</td>
<td>...</td>
</tr>
<tr>
<td>jwt</td>
<td>fastify-jwt</td>
<td>...</td>
</tr>
<tr>
<td>static</td>
<td>fastify-static</td>
<td>...</td>
</tr>
<tr>
<td>postgresql</td>
<td>fastify-postgres</td>
<td>...</td>
</tr>
<tr>
<td>mongodb</td>
<td>fastify-mongodb</td>
<td>...</td>
</tr>
<tr>
<td>templates</td>
<td>point-of-view</td>
<td>...</td>
</tr>
<tr>
<td>redis</td>
<td>fastify-redis</td>
<td>...</td>
</tr>
<tr>
<td>nextjs</td>
<td>fastify-nextjs</td>
<td>...</td>
</tr>
<tr>
<td>health</td>
<td>fastify-healthcheck</td>
<td>...</td>
</tr>
<tr>
<td>pressure</td>
<td>under-pressure</td>
<td>...</td>
</tr>
<tr>
<td>bcrypt</td>
<td>fastify-bcrypt</td>
<td>...</td>
</tr>
</tbody>
</table>

</td>
</tr>
</table>
