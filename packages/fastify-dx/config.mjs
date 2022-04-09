#!/usr/bin/env node

import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import arg from 'arg'
import { hooks, methods } from 'fastify-apply/applicable.mjs'

import log from './logger.mjs'

// Common Fastify plugins recognizable via a shorthand keyword
const plugins = {
  accepts: 'fastify-accepts', // https://github.com/fastify/fastify-accepts#readme
  csrf: 'fastify-csrf', // https://github.com/fastify/fastify-csrf#readme
  cors: 'fastify-cors', // https://github.com/fastify/fastify-cors#readme
  cookie: 'fastify-cookie', // https://github.com/fastify/fastify-cookie#readme
  compress: 'fastify-compress', // https://github.com/fastify/fastify-compress#readme
  helmet: 'fastify-helmet', // https://github.com/fastify/fastify-helmet#readme
  jwt: 'fastify-jwt', // https://github.com/fastify/fastify-jwt
  static: 'fastify-static', // https://github.com/fastify/fastify-static
  postgresql: 'fastify-postgres', // https://github.com/fastify/fastify-postgres
  mongodb: 'fastify-mongodb', // https://github.com/fastify/fastify-mongodb
  templates: 'point-of-view', // https://github.com/fastify/point-of-view
  redis: 'fastify-redis', // https://github.com/fastify/fastify-redis#readme
  nextjs: 'fastify-nextjs', // https://github.com/fastify/fastify-nextjs
  health: 'fastify-healthcheck', // https://github.com/smartiniOnGitHub/fastify-healthcheck
  pressure: 'under-pressure', // https://github.com/fastify/under-pressure
  bcrypt: 'fastify-bcrypt', // https://github.com/heply/fastify-bcrypt
}

// Available Fastify-Vite renderer adapters
const renderers = {
  vue: () => import('fastify-vite-vue'),
  react: () => import('fastify-vite-react'),
  solid: () => import('fastify-vite-solid'),
}

async function getRenderer (renderer) {
  if (!renderer) {
    renderer = await renderers.vue()
    console.log('renderer', renderer)
  } else if (typeof renderer === 'string') {
    if (renderers[renderer]) {
      renderer = await renderers[renderer]()
    } else {
      log.error(`Unknown renderer \`${renderer}\``)
      await exit()
    }
  }
  return renderer
}

async function resolveInit (filename) {
  if (!filename) {
    return [{}, process.cwd()]
  }
  for (const variant of [filename, `${filename}.mjs`, `${filename}.js`]) {
    const resolvedPath = resolve(process.cwd(), variant)
    if (existsSync(resolvedPath)) {
      const app = await import(resolvedPath)
      return [app, dirname(resolvedPath)]
    }
  }
}

async function exit () {
  try {
    await this.app?.close()
    setImmediate(() => process.exit(0))
  } catch (error) {
    this.app?.log.error(error)
    setImmediate(() => process.exit(1))
  }
}

function getCommands () {
  const argv = arg({
    '--url': Boolean,
    '--server': Boolean,
    '-s': '--server',
    '-u': '--url',
  })
  for (const cmd of ['setup', 'dev', 'eject', 'generate']) {
    if (argv._.includes(cmd)) {
      argv[cmd] = true
    }
  }
  return argv
}

export async function getConfig () {
  const { dev, eject, setup, _ } = getCommands()
  const filepath = (dev || eject || setup) ? _[1] : _[0]
  const [init, root] = await resolveInit(filepath)
  const renderer = await getRenderer(init.renderer)
  const applicable = {}
  for (const k of [...hooks, ...methods]) {
    applicable[k] = init[k]
  }
  const plugable = {}
  for (const k of Object.keys(plugins)) {
    if (init[k]) {
      plugable[k] = init[k]
    }
  }
  return {
    dev,
    setup,
    eject,
    exit,
    root,
    renderer,
    init: init.default,
    env: init.env,
    tenants: init.tenants,
    port: init.port || 3000,
    host: init.host,
    plugable,
    applicable,
    update (obj) {
      Object.assign(this, obj)
    },
  }
}
