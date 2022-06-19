import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import viteVue from '@vitejs/plugin-vue'
import viteVueFastifyDX from 'fastify-dx-vue/plugin'
import unocss from 'unocss/vite'

const path = fileURLToPath(import.meta.url)

const root = join(dirname(path), 'client')
const plugins = [
  unocss(),
  viteVue(), 
  viteVueFastifyDX(),
]

export default {
  root,
  plugins,
}
