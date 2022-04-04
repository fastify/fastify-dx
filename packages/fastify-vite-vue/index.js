const { resolve } = require('path')
const { createRenderFunction } = require('./render')

module.exports = {
  path: resolve(__dirname),
  createRenderFunction,
}
module.exports.default = module.exports
