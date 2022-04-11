const { resolve } = require('path')
const { createRenderFunction } = require('./render')
const { fetch } = require('undici')

module.exports.path = resolve(__dirname)
module.exports.serverEntryPoint = '/entry/server.js'
module.exports.clientEntryPoint = '/entry/client.js'
module.exports.createRenderFunction = createRenderFunction
module.exports.getRouteSetter = getRouteSetter
module.exports.blueprints = ['base']
module.exports.default = module.exports

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
