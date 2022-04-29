#!/usr/bin/env node

import { existsSync } from 'fs'
import { join, resolve, normalize, win32, isAbsolute } from 'path'
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

async function getRenderer (renderer, root) {
  if (!renderer && renderer !== false) {
    if (existsSync(join(root, 'renderer.js'))) {
      const rendererModule = await import(join(root, 'renderer.js'))
      if (rendererModule.default) {
        renderer = rendererModule.default
      }
    }
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

export async function getConfig (initPath) {
  const { start, dev, build, eject, setup, _: args } = getCommands()
  if (start || dev || build || eject || setup) {
    initPath = args[1]
  } else {
    initPath = args[0]
  }
  const root = resolveRoot(initPath)
  const init = await resolveServerInit(root)
  const renderer = await getRenderer(init?.renderer, root)
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
  for (const cmd of ['start', 'dev', 'setup', 'eject', 'build', 'generate']) {
    if (argv._[0] === cmd) {
      argv[cmd] = true
    }
  }
  return argv
}

function resolveRoot (initPath) {
  if (!initPath) {
    return process.cwd()
  }
  const normalized = process.platform === 'win32'
    ? win32.normalize(initPath)
    : normalize(initPath)
  if (isAbsolute(normalized)) {
    return normalized
  } else {
    return resolve(process.cwd(), initPath)
  }
}

async function resolveServerInit (root) {
  const serverDir = join(root, 'server')
  if (existsSync(serverDir)) {
    return resolveServerInit(serverDir)
  }
  for (const variant of ['server.js', 'server.mjs']) {
    const serverInitPath = join(root, variant)
    if (existsSync(serverInitPath)) {
      return await import(serverInitPath)
    }
  }
}
