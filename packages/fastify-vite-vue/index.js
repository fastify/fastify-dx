const { resolve } = require('path')
const { createRouteFunction } = require('./routing')
const { createRenderFunction } = require('./render')

module.exports.path = resolve(__dirname)
module.exports.serverEntryPoint = '/entry/server.js'
module.exports.clientEntryPoint = '/entry/client.js'
module.exports.createRenderFunction = createRenderFunction
module.exports.createRouteFunction = createRouteFunction
module.exports.default = module.exports
