const { readFileSync, existsSync } = require('fs')
const { dirname, join, resolve } = require('path')
const { fileURLToPath } = require('url')

function viteReactFastifyDX (config = {}) {  
  const prefix = /^\/?dx:/
  const routing = Object.assign({
    globPattern: '/pages/**/*.jsx',
    paramPattern: /\[(\w+)\]/,
  }, config)
  const virtualRoot = resolve(__dirname, 'virtual')
  const virtualModules = { 
    'base.jsx': 'base.jsx',
    'mount': 'mount.js', 
    'resource': 'resource.js',
    'context.jsx': 'context.jsx',
    'router.jsx': 'router.jsx',
    'routes': 'routes.js',
  }
  const virtualModuleInserts = {
    'routes': {
      $globPattern: routing.globPattern,
      $paramPattern: routing.paramPattern,
    }
  }

  let viteProjectRoot

  function loadVirtualModuleOverride (virtual) {
    if (!virtual) {
      return
    }
    const overridePath = resolve(viteProjectRoot, virtualModules[virtual])
    if (existsSync(overridePath)) {
      return overridePath
    }
  }

  function loadVirtualModule (virtual) {
    if (!virtual) {
      return
    }
    let code = readFileSync(resolve(virtualRoot, virtualModules[virtual]), 'utf8')
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
    name: 'vite-plugin-react-fastify-dx',
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
      if (virtual && virtualModules[virtual]) {
        return loadVirtualModule(virtual)
      }
    },
  }
}

module.exports = viteReactFastifyDX
