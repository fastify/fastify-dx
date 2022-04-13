#!/usr/bin/env node

import { existsSync, lstatSync } from 'fs'
import { sep, join, resolve, parse as parsePath } from 'path'
import arg from 'arg'
import { hooks, methods } from 'fastify-apply/applicable.mjs'
import { error } from './logger.mjs'

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
  if (!renderer && renderer !== false) {
    renderer = await renderers.vue()
  } else if (typeof renderer === 'string') {
    if (renderers[renderer]) {
      renderer = await renderers[renderer]()
    } else {
      error(`Unknown renderer \`${renderer}\``)
      await exit()
    }
  }
  return renderer
}

async function resolveInit (initPath) {
  if (!initPath) {
    return [null, process.cwd()]
  }
  if (!initPath.startsWith(sep) && !initPath.startsWith('.')) {
    initPath = join(process.cwd(), initPath)
  }
  const { name, dir } = parsePath(initPath)
  if (existsSync(initPath)) {
    let filePathCandidate
    let filePath
    if (lstatSync(initPath).isDirectory()) {
      const name = 'server'
      for (const variant of [name, `${name}.mjs`, `${name}.js`]) {
        filePathCandidate = resolve(initPath, variant)
        if (existsSync(filePathCandidate)) {
          filePath = filePathCandidate
        }
      }
    }
    if (lstatSync(filePath).isDirectory()) {
      return resolveInit(filePath)
    } else {
      const app = await import(filePath)
      return [app, initPath]
    }
  } else {
    for (const variant of [name, `${name}.mjs`, `${name}.js`]) {
      const filePath = resolve(dir, variant)
      if (existsSync(filePath)) {
        const app = await import(filePath)
        return [app, initPath]
      }
    }
  }
  return [null, initPath]
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
    if (argv._[0] === cmd) {
      argv[cmd] = true
    }
  }
  return argv
}

export async function getConfig (initPath = 'server') {
  const { dev, eject, setup, _: args } = getCommands()
  if (dev || eject || setup) {
    initPath = args[1] ?? initPath
  } else {
    initPath = args[0]
  }
  const [init, root] = await resolveInit(initPath)

  const renderer = await getRenderer(init?.renderer)
  const applicable = {}
  const plugable = {}
  if (init) {
    for (const k of [...hooks, ...methods]) {
      applicable[k] = init[k]
    }
    for (const k of Object.keys(plugins)) {
      if (init[k]) {
        plugable[k] = init[k]
      }
    }
  }
  return {
    dev,
    setup,
    eject,
    exit,
    root,
    renderer,
    initPath,
    init: init?.default,
    env: init?.env,
    port: init?.port ?? 3000,
    host: init?.host,
    plugable,
    applicable,
    update (obj) {
      Object.assign(this, obj)
    },
  }
}

export function suppressExperimentalWarnings () {
  // See https://github.com/nodejs/node/issues/30810
  const { emitWarning } = process

  process.emitWarning = (warning, ...args) => {
    if (args[0] === 'ExperimentalWarning') {
      return
    }
    if (args[0] && typeof args[0] === 'object' && args[0].type === 'ExperimentalWarning') {
      return
    }
    return emitWarning(warning, ...args)
  }
}
