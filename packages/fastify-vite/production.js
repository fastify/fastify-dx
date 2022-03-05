const FastifyStatic = require('fastify-static')
const { resolve } = require('path')
const { kEmitter } = require('./symbols')

async function setup (options) {
  // For production you get the distribution version of the render function
  const { assetsDir } = options.vite.build
  // We also register fastify-static to serve all static files
  // in production (dev server takes of this)
  // Note: this is just to ensure it works, for a real world
  // production deployment, you'll want to capture those paths in
  // Nginx or just serve them from a CDN instead
  await this.scope.register(FastifyStatic, {
    root: resolve(options.distDir, `client/${assetsDir}`),
    prefix: `/${assetsDir}`,
  })
  options.template = await options.html(options.distIndex)
  options.entry ??= options.renderer.entry ?? getEntry
  options.handler ??= options.renderer.handler ?? getHandler

  const { render, routes } = await options.entry(options)
  const handler = options.handler(this.scope, options, render)

  this[kEmitter].emit('ready', { routes, handler })
}

module.exports = setup

async function getEntry (options) {
  // Load production template source only once in prod
  const serverBundle = require(resolve(this.options.distDir, 'server/server.cjs'))
  const entry = serverBundle.default ?? serverBundle
  return { routes: await entry.routes?.(), render: entry.render }
}

function getHandler (scope, options, render) {
  return async function (req, reply) {
    const url = req.raw.url
    const fragments = await render(scope, req, reply, url, options)
    reply.type('text/html')
    reply.send(options.template(req, fragments))
  }
}
