const viteVue = require('@vitejs/plugin-vue')
const viteVueJsx = require('@vitejs/plugin-vue-jsx')
const viteBlueprint = require('vite-plugin-blueprint')

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  logLevel: dev ? 'error' : 'info',
  plugins: [
    viteVue(),
    viteVueJsx(),
  ],
  // Base build settings, default values
  // for assetsDir and outDir match Vite's defaults
  build: {
    assetsDir: 'assets',
    outDir: 'dist',
    minify: !dev,
  },
  ssr: {
    external: [
      'fastify-vite-vue/routing',
      'fastify-vite-vue/app',
      'fastify-vite-vue/server',
    ],
  },
}
