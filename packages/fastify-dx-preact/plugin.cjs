const { readFileSync, existsSync } = require('fs')
const { resolve } = require('path')

function vitePreactFastifyDX (config = {}) {  
  const prefix = /^\/?dx:/
  const routing = Object.assign({
    globPattern: '/pages/**/*.jsx',
    paramPattern: /\[(\w+)\]/,
  }, config)
  const virtualRoot = resolve(__dirname, 'virtual')
  const virtualModules = [ 
    'mount.js', 
    'resource.js',
    'routes.js',
    'layouts.js',
    'create.jsx',
    'root.jsx',
    'layouts/',
    'context.js',
    'core.jsx'
  ]
  virtualModules.includes = function (virtual) {
    if (!virtual) {
      return false
    }
    for (const entry of this) {
      if (virtual.startsWith(entry)) {
        return true
      }
    }
    return false
  }
  const virtualModuleInserts = {
    'routes.js': {
      $globPattern: routing.globPattern,
      $paramPattern: routing.paramPattern,
    }
  }

  let viteProjectRoot

  function loadVirtualModuleOverride (virtual) {
    if (!virtualModules.includes(virtual)) {
      return
    }
    const overridePath = resolve(viteProjectRoot, virtual)
    if (existsSync(overridePath)) {
      return overridePath
    }
  }

  function loadVirtualModule (virtual) {
    if (!virtualModules.includes(virtual)) {
      return
    }
    let code = readFileSync(resolve(virtualRoot, virtual), 'utf8')
    if (virtualModuleInserts[virtual]) {
      for (const [key, value] of Object.entries(virtualModuleInserts[virtual])) {
        code = code.replace(new RegExp(escapeRegExp(key), 'g'), value)
      }
    }
    return {
      code,
      map: null,
    }
  }

  // Thanks to https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
  function escapeRegExp (s) {
    return s
      .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      .replace(/-/g, '\\x2d')
  }

  return {
    name: 'vite-plugin-preact-fastify-dx',
    config (config, { command }) {
      if (command === 'build' && config.build?.ssr) {
        config.build.rollupOptions = {
          output: {
            format: 'es',
          },
        }
      }
    },
    configResolved (config) {
      viteProjectRoot = config.root
    },
    async resolveId (id) {
      const [, virtual] = id.split(prefix)
      if (virtual) {
        const override = await loadVirtualModuleOverride(virtual)
        if (override) {
          return override
        }
        return id
      }
    },
    load (id) {
      const [, virtual] = id.split(prefix)
      return loadVirtualModule(virtual)
    },
  }
}

module.exports = vitePreactFastifyDX
