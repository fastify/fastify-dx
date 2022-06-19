import { inject } from 'vue'
import { 
  useRoute,
  createRouter, 
  createMemoryHistory, 
  createWebHistory
} from 'vue-router'
// import layouts from '/dx:layouts.js'
// 
const isServer = typeof process === 'object'

export const createHistory = isServer
  ? createMemoryHistory
  : createWebHistory

// export const RouteContext = createContext({})

export function useRouteContext () {
  if (isServer) {
    const ctxHydration = inject('ctxHydration')
    console.log('ctxHydration', ctxHydration)
    return ctxHydration
  } else {
    const route = useRoute()
    return route.meta
  }
}

  // url,
  // routes,
  // head,
  // routeMap,
  // ctxHydration,


export async function jsonDataFetch (path) {
  const response = await fetch(`/-/data${path}`)
  let data
  let error
  try {
    data = await response.json()
  } catch (err) {
    error = err
  }
  if (data?.statusCode === 500) {
    throw new Error(loader.data.message)
  }
  if (error) {
    throw error
  }
  return data
}

export function createBeforeEachHandler ({
  head, 
  ctxHydration, 
  routeMap,
}) {
  // ctx, 
  return (to, from) => {
    // Note that on the client, window.route === ctxHydration

    // Indicates whether or not this is a first render on the client
    ctx.firstRender = window.route.firstRender

    // If running on the client, the server context data
    // is still available from the window.route hydration
    if (ctx.firstRender) {
      ctx.data = window.route.data
      ctx.head = window.route.head
      // Clear hydration so all URMA hooks 
      // start running client-side
      window.route.firstRender = false
    }

    const ctx = routeMap[to.matched[0].path]
    to.meta.layout = ctx.layout
 
    // If we have a getData function registered for this route
    if (!ctx.data && ctx.getData) {
      // try {
      //   const { pathname, search } = location
      //   // If not, fetch data from the JSON endpoint
      //   ctx.data = waitFetch(`${pathname}${search}`)
      // } catch (status) {
      //   // If it's an actual error...
      //   if (status instanceof Error) {
      //     ctx.error = status
      //   }
      //   // If it's just a promise (suspended state)
      //   throw status
      // }
    }

    // Note that ctx.loader() at this point will resolve the
    // memoized module, so there's barely any overhead

    if (!ctx.firstRender && ctx.getMeta) {
      // const updateMeta = async () => {
      //   const { getMeta } = await ctx.loader()
      //   head.update(await getMeta(ctx))
      // }
      // waitResource(path, 'updateMeta', updateMeta)
    }

    if (!ctx.firstRender && ctx.onEnter) {
      // const runOnEnter = async () => {
      //   const { onEnter } = await ctx.loader()
      //   const updatedData = await onEnter(ctx)
      //   if (!ctx.data) {
      //     ctx.data = {}
      //   }
      //   Object.assign(ctx.data, updatedData)
      // }
      // waitResource(path, 'onEnter', runOnEnter)
    }
  }
}
