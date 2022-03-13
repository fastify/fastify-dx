import { fetch } from 'undici'

export function getRouteSetter (scope, handler) {
  return (url, routeOptions) => {
    const preHandler = routeOptions.preHandler || []
    if (routeOptions.getData) {
      preHandler.push(getData)
    }
    if (routeOptions.getPayload) {
      preHandler.push(routeOptions.getPayload)
      scope.get(`/-/payload${url}`, getPayloadHandler(scope, routeOptions.getPayload))
    }
    scope.route({
      url,
      handler,
      ...routeOptions,
      preHandler,
    })
  }
}

async function getDataHandler (scope, getData) {
  return async function (req, reply) {
    req.data = await getData(
      fetch,
      fastify: scope,
      req,
      reply,
    )
  }
}

function getPayloadHandler (scope, getPayload) {
  return async function (req, reply) {
    req.payload = await getPayload({
      fetch,
      app: scope,
      req,
      reply,
    })
  }
}
