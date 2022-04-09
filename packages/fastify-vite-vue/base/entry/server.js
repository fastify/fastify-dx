import { createRenderFunction } from 'fastify-vite-vue'
import { createApp } from './app'

import routes from './routes'

export default {
  routes,
  render: createRenderFunction(createApp),
}
