# universify

Fastify's DX-oriented CLI for SSR-enabled application development powered by Vite.

**Status**: experimental, in active development.

```sh
npm i universify
```

## Running single Fastify app

Create `app.mjs` file as follows:

```js
export default (app) => {
  app.get('/', (_, reply) => reply.send('Hello world'))
}
```

Run with:

```sh
npx uni app
```

## Running multi-tenant Fastify app

Create `bar.mjs` file as follows:

```js
export default (app) => {
  app.get('/', (_, reply) => reply.send('Hello from bar.dev'))
}
```

Create `foo.mjs` file as follows:

```js
export default (app) => {
  app.get('/', (_, reply) => reply.send('Hello from foo.dev'))
}
```

Create `app.mjs` file as follows:

```js
export const tenants = {
  foo: 'foo.dev',
  bar: 'bar.dev',
}
```

Add relevant entries to `/etc/hosts` for testing:

```
::1 foo.dev
::1 bar.dev
```

Run with:

```sh
npx uni app
```
