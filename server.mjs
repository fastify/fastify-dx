
import Fastify from 'fastify'
import FastifySensible from 'fastify-sensible'
import FastifyPlugin from 'fastify-plugin'
import FastifyVite from 'fastify-vite'

import { devLogger } from './core.mjs'

export async function setup (context, dispatcher) {  
  const {
    init,
    renderer,
    root,
    dev,
    server,
    tenants
  } = context

  const app = Fastify({
    logger: {
      prettyPrint: dev ? devLogger : false,
    },
    ...server
  })

  context.update({ app })

  await app.register(FastifySensible)

  if (renderer) {
    await app.register(FastifyVite, { dev, root, renderer })
    if (dispatcher.is('generate', 'build')) {
      app.vite.options.update({ dev: false })
    }
    if (dispatcher.is('build')) {
      await app.vite.build()
      await dispatcher.exit()
    }
    if (dispatcher.is('generate')) {
      await app.vite.build()
      await app.vite.generate()
      await dispatcher.exit()
    }    
    await dispatcher('eject', 'build', 'generate')
    await app.vite.ready()
    await dispatcher('generate')
  }

  if (typeof init === 'function') {
    const initializer = FastifyPlugin(async function () {
      await init(app, context)
    })

    await app.register(initializer)
  }

  return app
}

export async function listen (app, { dev, port, host }) {
  if (dev) {
    app.log.info('Development mode is enabled')
  }
  await app.listen(port, host)
}
