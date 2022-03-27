
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'

import arg from 'arg'
import { hooks, methods } from 'fastify-apply/applicable.mjs'
import plugins from './plugins.mjs'

export async function resolveInit (filename) {
  for (const variant of [filename, `${filename}.mjs`, `${filename}.js`]) {
    console.log('->', process.cwd(), variant)
    const resolvedPath = resolve(process.cwd(), variant)
    if (existsSync(resolvedPath)) {
      const app = await import(resolvedPath)
      return [app, dirname(resolvedPath)]
    }
  }
}

export const kImmediate = Symbol('kImmediate')

export function immediate (command) {
  command[kImmediate] = true
  return command
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

export function getCommand () {
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
      if (argv[command] && callback) {
        return callback(argv[command])
      }
    }
  }
  console.log('argv', argv, process.argv)
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

export async function getContext (argv) {
  const filepath = argv._[0] === 'dev' ? argv._[1] : argv._[0]
  console.log('argv._', argv._)
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

export const devLogger = {
  translateTime: 'HH:MM:ss Z',
  ignore: 'pid,hostname',
}
