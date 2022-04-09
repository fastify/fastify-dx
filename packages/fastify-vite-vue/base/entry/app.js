import { createSSRApp } from 'vue'
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'
import { createBeforeEachHandler } from './core.js'

import app from './app.vue'
import routes from './routes.js'

const createHistory = import.meta.env.SSR
  ? createMemoryHistory
  : createWebHistory

export async function createApp (ctx) {
  const resolvedRoutes = await routes()
  const app = createSSRApp(app)
  const head = createHead()
  const router = createRouter({
    history: createHistory(),
    routes: resolvedRoutes,
  })
  if (!import.meta.env.SSR) {
    router.beforeEach(createBeforeEachHandler(resolvedRoutes))
  }
  app.use(router)
  app.use(head)
  return { ctx, app, head, router, routes: resolvedRoutes }
}
