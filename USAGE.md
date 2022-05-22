#### <img width="200px" alt="Fastify DX" src="https://user-images.githubusercontent.com/12291/163095704-d1bd8541-ecde-4707-8068-17d2fd725c01.svg">(alpha)

**Fastify DX** is a **full stack framework** built on top of [**Fastify**](https://fastify.io) and [**Vite**](https://vitejs.org).

In this early stage, it's a collection of [**fastify-vite**](https://github.com/fastify/fastify-vite) renderer packages for a number of frameworks. 

They all follow the same specification, the [**Universal Route Module API**]().

A minimal [`zx`](https://github.com/google/zx)-based **CLI** for enhanced **developer experience** is also in the works.

## Install

If you already have a Fastify [configured with Vite](https://github.com/fastify/fastify-vite) for **SSR**, install any of the renderer packages:

```bash
npm install fastify-dx-vue -P
npm install fastify-dx-react -P
npm install fastify-dx-svelte -P
npm install fastify-dx-solid -P
```

Assign the `renderer` **fastify-vite** configuration option with the package, e.g.:

```js
import Fastify from 'fastify'
import DXReact from 'fastify-dx-react'

const root = import.meta.url
const server = Fastify()
await server.register(FastifyVite, { root, renderer: DXReact })
```

Or, if you're starting a new project, get a copy of any of the [starter boilerplates]().

```bash
degit fastify/fastify-dx/starters/vue
degit fastify/fastify-dx/starters/react
degit fastify/fastify-dx/starters/svelte
degit fastify/fastify-dx/starters/solid
```

In the snippet above [`degit`]() is used to automate copying from this repostiroy.

## Usage

The Fastify DX renderer packages for fastify-vite expand your route component modules following the [**Universal Route Module API**]() specification. These include a series of **special exports** which can be used to control things like data fetching (both on the client and server), `<head>` tag information and **rendering mode** (SSR or CSR).
  
The starter boilerplates include examples for all supported features.

See the [**Universal Route Module API**]() specification for details.
