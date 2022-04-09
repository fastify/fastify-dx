const { resolve, exists, read } = require('./ioutils')
const { resolveConfig } = require('vite')

class Options {
  // Whether or not to enable Vite's Dev Server
  dev = false

  // Prevents ExperimentalWarning messages due to use of undici etc
  suppressExperimentalWarnings = true

  // The fastify-vite renderer adapter to use
  renderer = null

  // Init bundled distribution settings
  distManifest = null
  distIndex = null
  distDir = null

  // Overridable internal APIs

  // Set to html.js#compileIndexHtml unless overriden
  html = null
  // Set to either <mode>.js#getEntry unless overriden
  entry = null
  // Set to either <mode>.js#getHandler unless overriden
  handler = null
  // Set to either routing.js#getRouteSetter unless overriden
  route = null

  // Create options based on defaults and immediately
  // compute the distribution bundle settings via update()
  constructor (options) {
    // Dynamically determine bundled distribution settings
    this.update(options);
    if (this.suppressExperimentalWarnings) {
      suppressExperimentalWarnings()
    }
  }

  // Update bundled distribution settings according to running mode
  update (options) {
    Object.assign(this, options)
  }

  async updateViteConfig (viteCommand, overrides = {}) {
    const dev = overrides.dev ?? this.dev
    const mode = dev ? 'development' : 'production'
    const vite = await resolveConfig({}, viteCommand, mode)
    Object.assign(this, { dev, vite, root: vite.root })
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
}

async function getOptions (overrides = {}, viteCommand = 'serve') {
  const options = new Options(overrides)
  await options.updateViteConfig(viteCommand)
  return options
}

module.exports = { getOptions }
module.exports.default = module.exports

function suppressExperimentalWarnings () {
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
