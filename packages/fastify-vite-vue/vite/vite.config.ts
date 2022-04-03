import { defineConfig } from 'vite'
import viteVue from '@vitejs/plugin-vue'
import viteVueJsx from '@vitejs/plugin-vue-jsx'
import viteBlueprint from 'vite-plugin-blueprint'
import fastifyViteVue from 'fastify-vite-vue'

const dev: Boolean = process.env.NODE_ENV !== 'production'

export default defineConfig({
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
})
