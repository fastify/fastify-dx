const { resolve, exists, read } = require('./ioutils')
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
  // Prevents ExperimentalWarning messages due to use of undici etc
  suppressExperimentalWarnings = true
  // The fastify-vite renderer adapter to use
  renderer = null
}

async function configure (options = {}) {
  const vite = await resolveViteConfig(options)
  const bundle = await resolveBundleConfig(options)
  const options = new Config(overrides)
  return options
}

async function getBuildCommands ({ renderer, configFile }) {
  const vite = await resolveConfig({}, 'build', 'production')
  return [
    `build --ssrManifest --outDir ${vite.build.outDir}/client`,
    `vite build --ssr ${renderer.serverEntryPoint} --outDir ${vite.build.outDir}/server`
  ]
}

async function resolveBundle () {
  if (!this.dev) {
    this.distDir = resolve(this.root, this.vite.build.outDir)
    const distIndex = resolve(this.distDir, 'client/index.html')
    if (!exists(distIndex)) {
      return
    }
    this.distIndex = await read(distIndex, 'utf8')
    this.distManifest = require(resolve(this.distDir, 'client/ssr-manifest.json'))
  } else {
    this.distManifest = []
  }
}

module.exports = { configure, getDist, getBuildCommands }
module.exports.default = module.exports
