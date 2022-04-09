import viteVue from '@vitejs/plugin-vue'
import viteVueJsx from '@vitejs/plugin-vue-jsx'

// @type {import('vite').UserConfig}
export default {
  plugins: [
    viteVue(),
    viteVueJsx(),
  ],
}
