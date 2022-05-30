import { lazy } from 'react'

class Routes extends Array {
  toJSON () {
    return this.map((route) => {
      return {
        id: route.id,
        path: route.path,
        getData: !!route.getData,
      }
    })
  }
}

export async function createRoutes (from, { param } = { param: /\[(\w+)\]/ }) {
  const importPaths = Object.keys(from)
  const promises = []
  // Ensure that static routes have precedence over the dynamic ones
  for (const path of importPaths.sort((a, b) => a > b ? -1 : 1)) {
    promises.push(
      getRouteModule(path, from[path])
        .then((routeModule) => {
          return {
            id: path,
            path: path
              // Remove /pages and .jsx extension
              .slice(6, -4)
              // Replace [id] with :id
              .replace(param, (_, m) => `:${m}`)
              // Replace '/index' with '/'
              .replace(/\/index$/, '/'),
            ...routeModule,
          }
        }),
    )
  }
  return new Routes(...await Promise.all(promises))
}

function getRouteModuleExports (routeModule) {
  return {
    // The Route component (default export)
    component: routeModule.default,
    // Route-level hooks
    getMeta: routeModule.getMeta,
    getData: routeModule.getData,
    // Other Route-level settings
    streaming: routeModule.streaming,
    clientOnly: routeModule.clientOnly,
    serverOnly: routeModule.serverOnly,
  }
}

async function getRouteModule (path, routeModule) {
  // const isServer = typeof process !== 'undefined'
  if (typeof routeModule === 'function') {
    routeModule = await routeModule()
    return getRouteModuleExports(routeModule)
  } else {
    return getRouteModuleExports(routeModule)
  }
}

export async function hydrateRoutes (from) {
  return window.routes.map((route) => {
    route.loader = memoImport(from[route.id])
    route.component = lazy(() => route.loader())
    return route
  })
}

const kFuncExecuted = Symbol('kFuncExecuted')
const kFuncValue = Symbol('kFuncValue')

function memoImport (func) {
  func[kFuncExecuted] = false
  return async function () {
    if (!func[kFuncExecuted]) {
      func[kFuncValue] = await func()
      func[kFuncExecuted] = true
    }
    return func[kFuncValue]
  }
}
