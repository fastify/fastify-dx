import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import viteVue from '@vitejs/plugin-vue'
import viteVueJsx from '@vitejs/plugin-vue-jsx'
import { viteESModuleSSR } from 'fastify-vite'

// @type {import('vite').UserConfig}
export default {
  root: join(dirname(fileURLToPath(import.meta.url)), 'client'),
  plugins: [
    viteVue(),
    viteVueJsx(),
    viteESModuleSSR(),
  ],
  ssr: {
    external: [
      'fastify-vite-vue',
    ],
  },
}
