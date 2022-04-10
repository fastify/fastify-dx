
function setupRouting ({ handler, routes }) {
  getRouteSetter ??= this.config.renderer.getRouteSetter
  this.route = getRouteSetter.call(this)
  for (const route of routes) {
    this.route(route.path, route)
  }
  function getRouteSetter () {
    return (url, routeOptions) => {
      this.scope.route({ url, handler, method: 'GET', ...routeOptions })
    }
  }
}

module.exports = { setupRouting }

// import { fetch } from 'undici'

// export function getRouteSetter (scope, handler) {
//   return (url, routeOptions) => {
//     const preHandler = routeOptions.preHandler || []
//     if (routeOptions.getData) {
//       preHandler.push(getDataHandler(scope, routeOptions.getData))
//     }
//     if (routeOptions.getPayload) {
//       const getPayload = getPayloadHandler(scope, routeOptions.getPayload)
//       preHandler.push(getPayload)
//       scope.get(`/-/payload${url}`, getPayload)
//     }
//     scope.route({
//       url,
//       handler,
//       ...routeOptions,
//       preHandler,
//     })
//   }
// }

// async function getDataHandler (scope, getData) {
//   return async function (req, reply) {
//     req.data = await getData({
//       fetch,
//       fastify: scope,
//       req,
//       reply,
//     })
//   }
// }

// function getPayloadHandler (scope, getPayload) {
//   return async function (req, reply) {
//     req.payload = await getPayload({
//       fetch,
//       app: scope,
//       req,
//       reply,
//     })
//   }
// }
