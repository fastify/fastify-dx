import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import arg from 'arg'

export async function resolveInit (filename) {
  for (const variant of [filename, `${filename}.mjs`, `${filename}.js`]) {
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
  const argv = arg(process.argv)
  return (...args) => {
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
}

export async function getContext (filename) {
  const [init, root] = await resolveInit(filename)
  return {
    exit,
    root,
    tenants: init.tenants,
    init: init.default,
    renderer: init.renderer,
    port: init.port || 3000,
    host: init.host,
    update (obj) {
      Object.assign(this, obj)
    },
  }
}

export const devLogger = {
  translateTime: 'HH:MM:ss Z',
  ignore: 'pid,hostname',
}
