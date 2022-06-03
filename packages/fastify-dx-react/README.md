# fastify-dx-react [![NPM version](https://img.shields.io/npm/v/fastify-dx-react.svg?style=flat)](https://www.npmjs.com/package/fastify-dx-react) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

## Install

## Usage

Basic server setup:

```js
import Fastify from 'fastify'
import FastifyVite from 'fastify-vite'
import FastifyDXReact from 'fastify-dx-react'

const server = Fastify()

await server.register(FastifyVite, { 
  root: import.meta.url, 
  renderer: FastifyDXReact,
  clientModule: '/client.js',
})

await server.vite.ready()
await server.listen(3000)
```

Minimal `vite.config.js` file:

```js
import { dirname } from 'path'
import viteReact from '@vitejs/plugin-react'
import viteReactFastifyDX from 'fastify-dx-react/plugin'

// @type {import('vite').UserConfig}
export default {
  root: dirname(new URL(import.meta.url).pathname),
  plugins: [
    viteReact({ jsxRuntime: 'classic' }),
    viteReactFastifyDX(),
  ],
}
```

### Routing mode

### Rendering mode

### Decoupled `<head>`

### Route Module API

