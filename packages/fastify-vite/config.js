const { join, resolve, exists, read } = require('./ioutils')
const { resolveConfig } = require('vite')

class Config {
  // Whether or not to enable Vite's Dev Server
  dev = false
  // Vite's configuration file location
  configRoot = null
  // Vite's resolved config
  vite = null
  // Vite's distribution bundle info
  bundle = {
    manifest: null,
    indexHtml: null,
    dir: null,
  }

  // The fastify-vite renderer adapter to use
  renderer = null
}

async function configure (options = {}) {
  const vite = await resolveViteConfig(options)
  const bundle = await resolveBundle(options)
  return Object.assign(new Config(), { ...options, vite, bundle })
}

async function resolveViteConfig (configRoot) {
  for (const ext of ['js', 'mjs', 'ts', 'cjs']) {
    const configFile = join(configRoot, `vite.config.${ext}`)
    if (exists(configFile)) {
      return await resolveConfig({ configFile }, 'build', 'production')
    }
  }
}

async function resolveBundle ({ dev, vite }) {
  const bundle = {}
  if (!dev) {
    bundle.dir = resolve(vite.root, vite.build.outDir)
    const indexHtmlPath = resolve(bundle.dir, 'client/index.html')
    if (!exists(indexHtmlPath)) {
      return
    }
    bundle.indexHtml = await read(indexHtmlPath, 'utf8')
    bundle.manifest = require(resolve(bundle.dir, 'client/ssr-manifest.json'))
  } else {
    bundle.manifest = []
  }
  return bundle
}

async function resolveBuildCommands (configRoot, renderer) {
  const vite = await resolveViteConfig(configRoot)
  return [
    `build --ssrManifest --outDir ${vite.build.outDir}/client`,
    `build --ssr ${renderer.serverEntryPoint} --outDir ${vite.build.outDir}/server`,
  ]
}

module.exports = { configure, resolveBundle, resolveBuildCommands }
module.exports.default = module.exports
