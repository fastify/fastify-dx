
import Fastify from 'fastify'
import FastifySensible from 'fastify-sensible'
import FastifyPlugin from 'fastify-plugin'
import FastifyVite from 'fastify-vite'

import { devLogger } from './core.mjs'

export async function setup (context, command) {
  const {
    init,
    renderer,
    root,
    dev,
    server,
  } = context

  const app = Fastify({
    logger: {
      prettyPrint: dev ? devLogger : false,
    },
    ...server,
  })

  context.update({ app })

  await app.register(FastifySensible)

  command('eject', () => {
    if (renderer) {

    }
  })

  if (renderer) {
    await app.register(FastifyVite, { dev, root, renderer })
    command('generate', 'build', () => {
      app.vite.options.update({ dev: false })
    })
    await command('build', async () => {
      await app.vite.build()
      await context.exit()
    })
    await command('generate', async () => {
      await app.vite.build()
    })
    await app.vite.ready()
    await command('generate', async () => {
      await app.vite.generate()
      await command.exit()
    })
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
