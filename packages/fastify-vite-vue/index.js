const { resolve } = require('path')

module.exports = {
  path: resolve(__dirname),
  blueprint: [
    'entry/client.js',
    'entry/server.js',
    'client.js',
    'client.vue',
    'head.js',
    'index.html',
    'routes.js',
  ],
}
