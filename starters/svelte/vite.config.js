import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { svelte as viteSvelte } from '@sveltejs/vite-plugin-svelte'
import viteSvelteFastifyDX from 'fastify-dx-svelte/plugin'
import unocss from 'unocss/vite'

const path = fileURLToPath(import.meta.url)

const root = join(dirname(path), 'client')
const plugins = [
  viteSvelte({
    compilerOptions: {
      hydratable: true,
    }
  }),
  viteSvelteFastifyDX(),
  unocss()
]

export default {
  root,
  plugins,
}
