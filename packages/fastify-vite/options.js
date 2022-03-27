const { fileURLToPath } = require('url')
const { existsSync, readFileSync } = require('fs')
const { resolve, dirname } = require('path')

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
    this.update(options)
  }

  // Update bundled distribution settings according to running mode
  update (options) {
    Object.assign(this, options)
    this.dev ??= process.env.NODE_ENV === 'production'
    if (!this.dev) {
      this.distDir = resolve(this.root, options.vite.build.outDir)
      const distIndex = resolve(this.distDir, 'client/index.html')
      if (!existsSync(distIndex)) {
        return
      }
      this.distIndex = readFileSync(distIndex, 'utf8')
      this.distManifest = require(resolve(this.distDir, 'client/ssr-manifest.json'))
    } else {
      this.distManifest = []
    }
  }

  async updateViteConfig (viteCommand, overrides = {}) {
    const dev = overrides.dev ?? options.dev
    const mode = dev ? 'development' : 'production'
    const vite = await resolveConfig({}, viteCommand, mode)
    Object.assign(this, { dev, vite })
  }
}

async function getOptions (overrides = {}, viteCommand = 'serve') {
  const options = new Options(overrides)
  await options.updateViteConfig(viteCommand)
  return options
}

module.exports = { Options, getOptions }
