const { fileURLToPath } = require('url')
const { existsSync, readFileSync } = require('fs')
const { resolve, dirname } = require('path')

module.exports = class Options {
  constructor (options) {
    // Whether or not to run in development mode
    this.dev = options.dev
    // Prevents ExperimentalWarning messages due to use of undici etc
    this.suppressExperimentalWarnings = options.suppressExperimentalWarnings ?? true
    // Vite root app directory, whatever you set here
    // is also set under `vite.root` so Vite picks it up
    this.root = this.setRoot(options)
    // Any Vite configuration option set here
    // takes precedence over <root>/vite.config.js
    this.renderer = null
    // Init bundled distribution settings
    this.distManifest = null
    this.distIndex = null
    this.distDir = null
    // Dynamically determine bundled distribution settings
    this.setDistSettings()
  }
  setRoot ({ root }) {
    if (typeof value === 'function') {
      this.root = options.root((...path) => {
        if (path.length && path[0].startsWith('file:')) {
          return resolve(dirname(fileURLToPath(path[0]), ...path.slice(1)))
        } else {
          return resolve(...path)
        }
      })
    } else if (options.root.startsWith('file:')) {
      options.root = dirname(fileURLToPath(options.root))
    } else {
      options.root = process.cwd()
    }
  }
  setDistSettings () {
    if (!this.dev) {
      this.distDir = resolve(this.root, this.vite.build.outDir)
      const distIndex = resolve(this.distDir, 'client/index.html')
      if (!existsSync(distIndex)) {
        return
      }
      this.distIndex = readFileSync(distIndex, 'utf8')
      this.distManifest = require(resolve(options.distDir, 'client/ssr-manifest.json'))
    } else {
      this.distManifest = []
    }
  }
}
