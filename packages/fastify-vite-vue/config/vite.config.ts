import { defineConfig } from 'vite'
import viteVue from '@vitejs/plugin-vue'
import viteVueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    viteVue(),
    viteVueJsx(),
  ],
})
