const { readFileSync, existsSync } = require('fs')
const { dirname, join, resolve } = require('path')
const { fileURLToPath } = require('url')

function viteReactFastifyDX () {
  let prefix = /^\/?dx:/
  let viteProjectRoot
  let virtualRoot = resolve(__dirname, 'virtual')
  let virtualModules = { 
    'mount': 'mount.js', 
    'resource': 'resource.js',
    'context.jsx': 'context.jsx',
    'router.jsx': 'router.jsx',
    'routes': 'routes.js',
  }

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
    return {
      code: readFileSync(resolve(virtualRoot, virtualModules[virtual]), 'utf8'),
      map: null,
    }
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
