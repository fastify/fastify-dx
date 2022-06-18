import { createApp, createSSRApp } from 'vue'
import { createRouter } from 'vue-router'
import { createHistory } from '/dx:core.js'
import root from '/dx:root.vue'

export default async function create (ctx) {
  console.log('ctx', ctx)
  const { url, routes, ctxHydration } = ctx
  const instance = ctxHydration.clientOnly
    ? createApp(root)
    : createSSRApp(root)

  const history = createHistory()
  const router = createRouter({ history, routes })
  const state = ctxHydration.state
  console.log('state', state)
  // instance.provide('state', state)
  instance.use(router)

  if (url) {
    router.push(url)
    await router.isReady()
  }

  return { instance, ctx, router }
}
