# universify

<img width="924" alt="Screen Shot 2022-03-01 at 22 17 27" src="https://user-images.githubusercontent.com/12291/156276225-d36ad7b1-43a8-42f2-b5e5-896672c53919.png">

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
