import { createHtmlFunction as _createHtmlFunction } from './html.js'
import { RouteContext } from './context.js'

export const createHtmlFunction = _createHtmlFunction

export default { 
  createHtmlFunction,
  createRouteHandler,
  createRoute,
}

export function createRouteHandler (client, scope, config) {
  return function (req, reply) {
    reply.html(reply.render(req))
  }
}

export function createRoute ({ client, handler, errorHandler, route }, scope, config) {
  if (route.getData) {
    // If getData is provided, register JSON endpoint for it
    scope.get(`/-/data${route.path}`, async (req, reply) => {
      reply.send(await route.getData())
    })
  }
  scope.get(route.path, {
    onRequest (req, reply, done) {
      req.route = new RouteContext(scope, req, reply, route, client)
      done()
    },
    // If getData is provided,
    // make sure it runs before the SSR route handler
    // ...route.getData && {
    //   async preHandler (req, reply) {
    //     req.route.data = await route.getData()
    //   },
    // },
    handler,
    errorHandler,
    ...route,
  })
}

