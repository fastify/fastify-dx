# universify

Fastify's DX-oriented CLI for SSR-enabled application development powered by Vite.

**Status**: experimental, in active development.

```sh
npm i universify
```

## Running vanilla Fastify app

Create `app.mjs` file as follows:

```js
export default (app) => {
  app.get('/', (_, reply) => reply.send('Hello world'))
}
```

Run with:

```sh
npx uni app dev
```

## Running Fastify-Vite app

Create `app.mjs` file as follows:

```js
import FastifyViteVue from 'fastify-vite-vue'

export const renderer = FastifyViteVue
```

Create `views/index.vue` and export `path` to set a route.

Run with:

```sh
npx uni app dev
```
