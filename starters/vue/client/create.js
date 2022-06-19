import { createApp, createSSRApp } from 'vue'
import { createRouter } from 'vue-router'
import { createHistory, jsonDataFetch } from '/dx:core.js'
import root from '/dx:root.vue'

const isServer = import.meta.env.SSR

export default async function create (ctx) {
  const { url, routes, head, ctxHydration, routeMap } = ctx

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
      console.log('wtf')
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
          console.error(error)
          ctx.error = error
        }
      }

      // Note that ctx.loader() at this point will resolve the
      // memoized module, so there's barely any overhead

      if (!ctx.firstRender && ctx.getMeta) {
        const { getMeta } = await ctx.loader()
        head.update(await getMeta(ctx))
      }

      if (!ctx.firstRender && ctx.onEnter) {
        const { onEnter } = await ctx.loader()
        const updatedData = await onEnter(ctx)
        if (updatedData) {
          if (!ctx.data) {
            ctx.data = {}
          }
          Object.assign(ctx.data, updatedData)
        }
      }

      to.meta = ctx
    })
  }

  instance.use(router)

  if (url) {
    router.push(url)
    await router.isReady()
  }

  return { instance, ctx, router }
}
