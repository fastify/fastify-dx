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

export default {
  root,
  plugins,
}
