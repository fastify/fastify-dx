import { join, dirname } from 'path'
import viteReact from '@vitejs/plugin-react'
import viteReactFastifyDX from 'fastify-dx-react/plugin'
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

// @type {import('vite').UserConfig}
export default {
  root: join(dirname(new URL(import.meta.url).pathname), 'client'),
  plugins: [
    viteReact({ jsxRuntime: 'classic' }),
    viteReactFastifyDX(),
  ],
  // ssr: {
  //   external: ['fastify-dx-react', 'react', 'react-dom'],
  // },
  // optimizeDeps:{
  //   exclude: ['fastify-dx-react', 'react'],
  //   esbuildOptions:{
  //     plugins:[
  //       esbuildCommonjs(['react', 'react-dom']),
  //     ]
  //   }
  // },
}

// Alternative configurations:

// viteReactFastifyDX({
//   glob: '/views/**/*.jsx',
//   mode: 'views',
// }),

// viteReactFastifyDX({
//   glob: '/routes/**/*.jsx',
//   mode: 'router',
// }),
