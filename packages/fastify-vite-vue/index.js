const { resolve } = require('path')
const { createRenderFunction } = require('./render')

module.exports.path = resolve(__dirname)
module.exports.createRenderFunction = createRenderFunction
module.exports.blueprints = ['base']
module.exports.default = module.exports
