const { fileURLToPath } = require('url')
const { existsSync, readFileSync } = require('fs')
const { resolve, dirname } = require('path')

class Options {
  // Whether or not to enable Vite's Dev Server
  dev = false

  // Prevents ExperimentalWarning messages due to use of undici etc
  suppressExperimentalWarnings = true

  // Vite root app directory, whatever you set here
  // is also set under `vite.root` so Vite picks it up
  root = null

  // Any Vite configuration option set here
  // takes precedence over <root>/vite.config.js
  renderer = null

  // Init bundled distribution settings
  distManifest = null
  distIndex = null
  distDir = null

  // Overridable internal APIs
  getEntry = null
  getHandler = null
  getRouteSetter = null

  // Create options based on defaults and immediately
  // compute the distribution bundle settings via update()
  constructor (options) {
    Object.assign(this, options)
    // Dynamically determine bundled distribution settings
    this.update()
  }

  // Update bundled distribution settings according to running mode
  update () {
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

function processOptions (options) {
  // The root path option can only be set once,
  // so we process it here, in the options factory function
  if (typeof options.root === 'function') {
    // The root property can be a function that has the same 
    // signature as path.resolve() but with works with ESM's file URLs
    options.root = options.root((...path) => {
      if (path.length && path[0].startsWith('file:')) {
        return resolve(dirname(fileURLToPath(path[0]), ...path.slice(1)))
      } else {
        return resolve(...path)
      }
    })
  } else if (options.root.startsWith('file:')) {
    // Adjust in case import.meta.url is passed as parameter
    options.root = dirname(fileURLToPath(options.root))
  } else if (typeof options.root === null) {
    // Assume current working directory if unset
    options.root = process.cwd()
  }
  return new Options(options)
}

module.exports = { processOptions }
