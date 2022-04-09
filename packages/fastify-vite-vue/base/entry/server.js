import { createApp } from '/client'
import { createRenderFunction } from 'fastify-vite-vue'
import routes from './routes'

export default {
  routes,
  render: createRenderFunction(createApp),
}
