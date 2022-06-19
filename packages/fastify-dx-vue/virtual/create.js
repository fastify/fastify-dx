import { createApp, createSSRApp } from 'vue'
import { createRouter } from 'vue-router'
import { createHistory, jsonDataFetch } from '/dx:core.js'
import root from '/dx:root.vue'

const isServer = import.meta.env.SSR

export default async function create (ctx) {
  const { url, routes, ctxHydration, routeMap } = ctx

  const instance = ctxHydration.clientOnly
    ? createApp(root)
    : createSSRApp(root)

  const history = createHistory()
  const router = createRouter({ history, routes })
  const state = ctxHydration.state

  if (isServer) {
    instance.provide('ctxHydration', ctxHydration)
  } else {
    router.beforeEach(async (to) => {
      // The client-side route context
      const ctx = routeMap[to.matched[0].path]

      // Indicates whether or not this is a first render on the client
      ctx.firstRender = window.route.firstRender

      // If running on the client, the server context data
      // is still available from the window.route hydration
      if (ctx.firstRender) {
        ctx.data = ctxHydration.data
        ctx.head = ctxHydration.head
        // Clear hydration so all URMA hooks 
        // start running client-side
        ctxHydration.firstRender = false
      }

      // If we have a getData function registered for this route
      if (!ctx.data && ctx.getData) {
        try {
          // If not, fetch data from the JSON endpoint
          ctx.data = await jsonDataFetch(to.fullPath)
        } catch (error) {
          ctx.error = error
        }
      }

      to.meta.ctxHydration = ctxHydration
    })
  }

  instance.use(router)

  if (url) {
    router.push(url)
    await router.isReady()
  }

  return { instance, ctx, router }
}
