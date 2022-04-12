const { fetch } = require('undici')

function getRouteSetter (scope, handler) {
  return (url, routeOptions = {}) => {
    const preHandler = routeOptions.preHandler || []
    if (routeOptions.getData) {
      preHandler.push(getDataHandler(scope, routeOptions.getData))
    }
    if (routeOptions.getPayload) {
      const getPayload = getPayloadHandler(scope, routeOptions.getPayload)
      preHandler.push(getPayload)
      scope.get(`/-/payload${url}`, getPayload)
    }
    scope.route({
      url,
      method: 'GET',
      handler,
      ...routeOptions,
      preHandler,
    })
  }
}

module.exports = { getRouteSetter }

function getDataHandler (scope, getData) {
  return async function (req, reply) {
    req.data = await getData({
      fetch,
      app: scope,
      req,
      reply,
    })
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
