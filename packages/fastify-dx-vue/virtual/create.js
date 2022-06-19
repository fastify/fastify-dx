import { createApp, createSSRApp, reactive } from 'vue'
import { createRouter } from 'vue-router'
import { 
  isServer, 
  createHistory, 
  serverRouteContext,
  createBeforeEachHandler
} from '/dx:core.js'
import root from '/dx:root.vue'

export default async function create (ctx) {
  const { routes, ctxHydration } = ctx

  const instance = ctxHydration.clientOnly
    ? createApp(root)
    : createSSRApp(root)

  const history = createHistory()
  const router = createRouter({ history, routes })
  
  ctxHydration.layout ??= 'default'
  ctxHydration.state = reactive(ctxHydration.state)

  if (isServer) {
    instance.provide(serverRouteContext, ctxHydration)
  } else {
    router.beforeEach(createBeforeEachHandler(ctx))
  }

  instance.use(router)

  if (ctx.url) {
    router.push(ctx.url)
    await router.isReady()
  }

  return { instance, ctx, router }
}
