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
    port: init.port,
    host: init.host,
  }
  return context
}

function applyHostContraint (host, method) {
  return (...args) => {
    console.log(args)
    let path
    let handler    
    let options = {
      constraints: { host }
    }
    path = args[0]
    if (args.length === 1) {
      Object.assign(options, {
        ...args[0],
        constraints: {
          ...options.constraints,
          ...args[0].constraints,
        }
      })
      return method(options)
    } else if (args.length === 2) {
      handler = args[1]
      console.log('options', options)
      return method(path, options, handler)
    } else if (args.length === 3) {
      Object.assign(options, {
        ...args[1],
        constraints: {
          ...options.constraints,
          ...args[1].constraints,
        }
      })
      handler = args[2]
      return method(path, options, handler)
    }
  }
}

export function applyTenantOverrides (tenantScope, tenantHost) {
  for (const method of ['route', 'get', 'post', 'put', 'delete', 'patch', 'options']) {
    tenantScope[method] = applyHostContraint(
      tenantHost, 
      tenantScope[method].bind(tenantScope)
    )
  }
}

export const devLogger = {
  translateTime: 'HH:MM:ss Z',
  ignore: 'pid,hostname'
}

