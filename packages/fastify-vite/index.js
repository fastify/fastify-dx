const { on, EventEmitter } = require('events')
const fp = require('fastify-plugin')
const { getOptions } = require('./options')

const build = require('./cmd/build')
const generate = require('./cmd/generate')
const production = require('./mode/production')
const development = require('./mode/development')

const { setupRouting } = require('./routing')
const { ensureConfigFile, ejectBlueprint } = require('./setup')
const { kHooks, kEmitter } = require('./symbols')

class Vite {
  constructor (scope, options) {
    this.scope = scope
    this.options = options
    this[kEmitter] = new EventEmitter()    
  }

  addHook (hook, handler) {
    if (hook in this[kHooks]) {
      this[kHooks][hook].push(handler)
    }
  }

  async ready () {
    this.options = await getOptions(this.options)
    if (this.options.dev) {
      await development.call(this, this.options)
    } else {
      await production.call(this, this.options)
    }
    setupRouting.call(this, await on('ready', this[kEmitter]))
  }

  async commands (exit = true) {
    if (generate || build) {
      this.options.update({ dev: false })
    }
    if (build) {
      await this.build()
      await this.exit()
    }
    if (generate) {
      await this.build()
    }
    await this.ready()
    if (generate) {
      this.scope.addHook('onReady', async () => {
        await this.generate()
        if (exit) {
          await this.exit()
        }
      })
    }
  }

  get (url, routeOptions) {
    return this.route(url, { method: 'GET', ...routeOptions })
  }

  post (url, { data, method, ...routeOptions } = {}) {
    return this.route(url, { data, method: 'GET', ...routeOptions })
  }
}

function fastifyVite (scope, options, done) {
  scope.decorate('vite', new Vite(scope, options))
  done()
}

module.exports = fp(fastifyVite)
module.exports.ensureConfigFile = ensureConfigFile
module.exports.ejectBlueprint = ejectBlueprint
module.exports.default = module.exports
