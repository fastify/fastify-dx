
import Fastify from 'fastify'
import FastifyPlugin from 'fastify-plugin'
import FastifySensible from 'fastify-sensible'
import FastifyApply from 'fastify-apply'
import FastifyVite from 'fastify-vite'

export async function setup (context) {
  const {
    dev,
    setup,
    init,
    renderer,
    root,
    server,
    applicable,
    plugable,
    exit,
  } = context

  const app = Fastify({ logger: true, ...server })

  context.update({ app })

  await app.register(FastifySensible)
  await app.register(FastifyApply)

  await Promise.all(Object.entries(plugable).map(([plugin, settings]) => {
    return app.register(plugin, settings)
  }))

  await app.register(FastifyVite, { dev, root, renderer })

  await app.apply(applicable)

  if (typeof init === 'function') {
    const initializer = FastifyPlugin(async function () {
      await init(app, context)
    })
    await app.register(initializer)
  }

  if (renderer) {

  }

  return app
}

export async function listen (app, { dev, port, host }) {
  if (dev) {
    app.log.info('Development mode is enabled')
  }
  await app.listen(port, host)
}
