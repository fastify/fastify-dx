#!/usr/bin/env node

import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import arg from 'arg'
import { hooks, methods } from 'fastify-apply/applicable.mjs'
import plugins from './plugins.mjs'
import { setup, listen } from './server.mjs'

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

// A simple command runner, will instantly parse
// process.argv and allow running a function at any
// given point in time if one or more commands are matched
const command = getCommand()

// A simple object to hold application
// context variables, including the app instance itself
const context = await getContext(command)

command('dev', () => {
  // This setting is passed down to
  // fastify-vite to enable Vite's Dev Server
  context.dev = true
})

// Get the Fastify server instance from setup()
const app = await setup(context, command)

// Unless we're running a generate command, start the server
if (!context.init?.generate?.server) {
  await listen(app, context)
}

async function resolveInit (filename) {
  for (const variant of [filename, `${filename}.mjs`, `${filename}.js`]) {
    const resolvedPath = resolve(process.cwd(), variant)
    if (existsSync(resolvedPath)) {
      const app = await import(resolvedPath)
      return [app, dirname(resolvedPath)]
    }
  }
}

function exit () {
  try {
    await this.app?.close()
    setImmediate(() => process.exit(0))
  } catch (error) {
    this.app?.log.error(error)
    setImmediate(() => process.exit(1))
  }
}

function getCommand () {
  const argv = arg({
    '--url': Boolean,
    '--server': Boolean,
    '-s': '--server',
    '-u': '--url',
  })
  const handler = (...args) => {
    let callback
    let commands
    if (typeof args[args.length - 1] === 'function') {
      callback = args[args.length - 1]
      commands = args.slice(0, -1)
    }
    for (const command of commands) {
      if (handler[command] && callback) {
        return callback(argv)
      }
    }
  }
  for (const k of Object.keys(argv)) {
    handler[k] = argv[k]
  }
  for (const cmd of ['dev', 'eject', 'generate']) {
    if (argv._.includes(cmd)) {
      handler[cmd] = true
    }
  }
  return handler
}

async function getContext (argv) {
  const filepath = argv._[0] === 'dev' ? argv._[1] : argv._[0]
  const [init, root] = await resolveInit(filepath)
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
    exit,
    root,
    tenants: init.tenants,
    init: init.default,
    renderer: init.renderer,
    port: init.port || 3000,
    host: init.host,
    plugable,
    applicable,
    update (obj) {
      Object.assign(this, obj)
    },
  }
}
