import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import kebabCase from 'lodash.kebabcase'

export  async function resolveInit (filename) {
  for (const variant of [filename, `${filename}.mjs`, `${filename}.js`]) {
    const resolvedPath = resolve(process.cwd(), variant)
    if (existsSync(resolvedPath)) {
      const app = await import(resolvedPath)
      return [app, dirname(resolvedPath)]
    }
  }
}

export function getDispatcher (context, commands) {
  const resolver = async () => {
    context.exit = async function  () {
      if (context.app) {
        await context.app.close()
      }
      setImmediate(() => process.exit(0))
    }
    for (let cmd of Object.keys(commands)) {
      if (process.argv.includes(kebabCase(cmd))) {
        await commands[cmd](context)
        break
      }
    }
  }
  context.resolver = resolver
  return resolver
}

export function getContext ({ init, root }) {
  const context = {
    root,
    tenants: init.tenants,
    init: init.default,
    renderer: init.renderer,
    port: init.port || 3000,
    host: init.host,
  }
  return context
}

export const devLogger = {
  translateTime: 'HH:MM:ss Z',
  ignore: 'pid,hostname'
}

