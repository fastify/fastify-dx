<sub>**Go back to the [index](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-svelte/README.md).**</sub>

<br>

## Basic setup

The [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/svelte) follows [fastify-vite](https://github.com/fastify/fastify-vite)'s convention of having a `client` folder with an `index.js` file, which is automatically resolved as your `clientModule` setting.

If you want flat directory setup, where server and client files are mixed together, you can manually set `clientModule` to something else. Note that in this case you'll also need to update `root` in your `vite.config.js` file.

When deploying to production, bear in mind the `client/dist` directory, generated when you run `npm run build`, needs to be included. You'll also want to enable Fastify's [built-in logging](https://www.fastify.io/docs/latest/Reference/Logging/):

```js
const server = Fastify({ logger: true })
```

The starter template's `server.js` file:

```js
import Fastify from 'fastify'
import FastifyVite from 'fastify-vite'
import FastifyDXSvelte from 'fastify-dx-svelte'

const server = Fastify()

await server.register(FastifyVite, { 
  root: import.meta.url, 
  renderer: FastifyDXSvelte,
})

await server.vite.ready()
await server.listen({ port: 3000 })
```

The starter template's [`vite.config.js`](https://github.com/fastify/fastify-dx/blob/main/starters/svelte/vite.config.js) file:

```js
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { svelte as viteSvelte } from '@sveltejs/vite-plugin-svelte'
import viteSvelteFastifyDX from 'fastify-dx-svelte/plugin'
import unocss from 'unocss/vite'
import { extractorSvelte } from '@unocss/core'

const path = fileURLToPath(import.meta.url)

const root = join(dirname(path), 'client')
const plugins = [
  unocss({ extractors: [extractorSvelte] }),
  viteSvelte({
    compilerOptions: {
      hydratable: true,
    }
  }),
  viteSvelteFastifyDX(),
]

export default { root, plugins }
```

Note that you only need to use Fastify DX's Vite plugin, which includes all functionality from [fastify-vite](https://github.com/fastify/fastify-vite)'s Vite plugin.

</td>
</tr>
</table>

### Route exports

Fastify DX picks up exports from route modules to determine route behavior and functionality, as per the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md). 

To add those exports, you must use `<script context="module">` (Svelte-specific syntax) which determines the script that runs in the general module namespace for a Svelte component. So in Fastify DX Svelte applications, it's commonplace to have two code blocks, a regular one and another with `context` set to `module`:

```html
<script context="module">
export function getData () {
  return { message: 'Hello from getData!' }
}
<script>

<script>
import { useRouteContext } = '/dx:core.js'
const { data } = useRouteContext()
</script>

<p>{data.message}</p>
```
