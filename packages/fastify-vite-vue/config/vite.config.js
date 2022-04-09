const viteVue = require('@vitejs/plugin-vue')
const viteVueJsx = require('@vitejs/plugin-vue-jsx')

// @type {import('vite').UserConfig}
module.exports = {
  plugins: [
    viteVue(),
    viteVueJsx(),
  ],
}
