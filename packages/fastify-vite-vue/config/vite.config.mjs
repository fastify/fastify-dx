import viteVue from '@vitejs/plugin-vue'
import viteVueJsx from '@vitejs/plugin-vue-jsx'
import { viteESModuleSSR } from 'fastify-vite'

// @type {import('vite').UserConfig}
export default {
  root: './client',
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
