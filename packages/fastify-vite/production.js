const FastifyStatic = require('fastify-static')

function setup ({ distIndex, renderer, vite, distDir }) {
  // For production you get the distribution version of the render function
  const { assetsDir } = vite.build
  // We also register fastify-static to serve all static files
  // in production (dev server takes of this)
  // Note: this is just to ensure it works, for a real world
  // production deployment, you'll want to capture those paths in
  // Nginx or just serve them from a CDN instead
  await this.scope.register(FastifyStatic, {
    root: resolve(distDir, `client/${assetsDir}`),
    prefix: `/${assetsDir}`,
  })
  const template = await renderer.compileIndexHtml(distIndex)
  const getEntry = options.getEntry ?? renderer.getEntry ?? getEntry
  const getHandler = options.getHandler ?? renderer.getHandler ?? getHandler
  
  const entry = await getEntry(options)
  const handler = getHandler(scope, options, this.entry, template)
  
  this[kEmitter].emit('ready', { routes: entry.routes, handler })
}

module.exports = setup

async function getEntry (options, vite) {
  // Load production template source only once in prod
  const serverBundle = require(resolve(this.options.distDir, 'server/server.cjs'))
  const entry = serverBundle.default ?? serverBundle
  return { routes: await entry.routes?.(), render: entry.render }
}

function getHandler (scope, options, render, template) {
  return async function (req, reply) {
    const url = req.raw.url
    const fragments = await render(scope, req, reply, url, options)
    reply.type('text/html')
    reply.send(template(req, fragments))
  } 
}
