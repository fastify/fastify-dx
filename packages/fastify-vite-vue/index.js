const { resolve } = require('path')
const { getRouteSetter } = require('./routing')
const { createRenderFunction } = require('./render')

module.exports.path = resolve(__dirname)
module.exports.serverEntryPoint = '/entry/server.js'
module.exports.clientEntryPoint = '/entry/client.js'
module.exports.createRenderFunction = createRenderFunction
module.exports.getRouteSetter = getRouteSetter
module.exports.default = module.exports
