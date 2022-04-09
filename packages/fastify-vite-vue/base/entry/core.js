import { reactive, getCurrentInstance, useSSRContext } from 'vue'
import { parse as parseRoute, match as matchRoute } from 'matchit'
import manifetch from 'manifetch'
export { useRoute } from 'vue-router'

const {
  kRoutes,
  kData,
  kPayload,
  kStaticPayload,
  kGlobal,
  kAPI,
  kIsomorphic,
  kFirstRender,
  kFuncValue,
  kFuncExecuted,
} = getSymbols()

const isServer = typeof window === 'undefined'

const appState = {
  [kIsomorphic]: null,
  [kFirstRender]: !isServer,
}

export function hydrateRoutes (globImports) {
  const routes = window[kRoutes]
  delete window[kRoutes]
  for (const route of routes) {
    route.component = memoized(globImports[route.componentPath])
  }
  return routes
}

export function createBeforeEachHandler (resolvedRoutes) {
  const {
    map: routeMap,
    parsed: parsedRoutes,
  } = makeRouteLookups(resolvedRoutes)
  return async (to) => {
    const ctx = useIsomorphic({ params: to.params })
    const {
      hasPayload,
      hasData,
      component,
    } = getRouteMeta(to, routeMap, parsedRoutes)
    if (!component) {
      return false
    }
    if (!!window[kStaticPayload] && hasPayload) {
      try {
        const response = await window.fetch(usePayloadPath(to))
        ctx.$payload = await response.json()
      } catch (error) {
        ctx.$errors.getPayload = error
      }
    } else if (!appState[kFirstRender] && (hasPayload || hasData)) {
      if (hasPayload) {
        try {
          const response = await window.fetch(usePayloadPath(to))
          ctx.$payload = await response.json()
        } catch (error) {
          ctx.$errors.getPayload = error
        }
      }
      if (hasData) {
        const { getData } = await component()
        try {
          ctx.$data = await getData(ctx)
        } catch (error) {
          ctx.$errors.getData = error
        }
      }
    }
  }
}

function getRouteMeta (route, map, parsed) {
  const match = matchRoute(route.path, parsed)
  return (match.length > 0 && map[match[0].old]) || {}
}

function makeRouteLookups (resolvedRoutes) {
  const map = {}
  const parsed = []
  for (const route of resolvedRoutes) {
    map[route.path] = route
    parsed.push(parseRoute(route.path))
  }
  return { map, parsed }
}

export function useIsomorphic (append) {
  if (isServer) {
    const ssrContext = useSSRContext()
    return Object.assign({
      $error: ssrContext.req.$error,
      $errors: ssrContext.$errors,
      $payload: ssrContext.$payload,
      $global: ssrContext.$global,
      $data: ssrContext.$data,
      $api: ssrContext.$api,
    }, append)
  } else {
    if (!appState[kIsomorphic]) {
      appState[kIsomorphic] = reactive({
        $error: null,
        $errors: {},
      })
    }
    Object.assign(appState[kIsomorphic], {
      $global: window[kGlobal],
      $api: new Proxy({ ...window[kAPI] }, {
        get: manifetch({
          prefix: '',
          fetch: (...args) => window.fetch(...args),
        }),
      }),
    }, append)
    if (!appState[kIsomorphic].$data) {
      appState[kIsomorphic].$data = window[kData]
      delete window[kData]
    }
    if (!appState[kIsomorphic].$payload) {
      appState[kIsomorphic].$payload = window[kPayload]
      delete window[kPayload]
    }
    return appState[kIsomorphic]
  }
}

export function hydrationDone () {
  if (appState[kFirstRender]) {
    appState[kFirstRender] = false
  }
}

export function usePayload () {
  const ctx = useIsomorphic()
  if ('getPayload' in ctx.$errors) {
    ctx.$error = ctx.$errors.getPayload
    return false
  }
  return ctx.$payload
}

export function useData () {
  const ctx = useIsomorphic()
  if ('getData' in ctx.$errors) {
    ctx.$error = ctx.$errors.getData
    return
  }
  return ctx.$data
}

export function useRequest () {
  if (isServer) {
    return useSSRContext().req
  }
}

export function useReply () {
  if (isServer) {
    return useSSRContext().reply
  }
}

export function useFastify () {
  if (isServer) {
    return useSSRContext().fastify
  }
}

export function useGlobalProperties () {
  return getCurrentInstance().appContext.app.config.globalProperties
}

export async function fetchPayload (route) {
  const payloadURL = usePayloadPath(route)
  const response = await window.fetch(payloadURL)
  return response.json()
}

export function getRoutes (views) {
  const routes = []
  for (const [componentPath, view] of Object.entries(views)) {
    const { default: component, ...viewProps } = view
    for (const path of flattenPaths(view.route)) {
      routes.push({ path, componentPath, component, ...viewProps })
    }
  }
  return routes.sort((a, b) => {
    if (b.path > a.path) {
      return 1
    } else if (a.path > b.path) {
      return -1
    } else {
      return 0
    }
  })
}

function flattenPaths (viewPath) {
  if (!viewPath) {
    return []
  }
  if (typeof viewPath === 'string') {
    return [viewPath]
  }
  if (Array.isArray(viewPath)) {
    return viewPath
  }
  return []
}
function usePayloadPath (route) {
  if (window[kStaticPayload]) {
    let { pathname } = Object.assign({}, document.location)
    if (pathname.endsWith('/')) {
      pathname = `${pathname}index`
    }
    return `${pathname.replace('.html', '')}.json`
  } else {
    return `/-/payload${route.path}`
  }
}

function memoized (func) {
  func[kFuncExecuted] = false
  return async function () {
    if (!func[kFuncExecuted]) {
      func[kFuncValue] = await func()
      func[kFuncExecuted] = true
    }
    return func[kFuncValue]
  }
}

function getSymbols () {
  return new Proxy({}, {
    get (_, prop) {
      return Symbol.for(prop)
    },
  })
}
