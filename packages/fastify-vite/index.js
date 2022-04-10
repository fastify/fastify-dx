const { once, EventEmitter } = require('events')
const { resolveConfig } = require('vite')
const fp = require('fastify-plugin')

const { configure, resolveBuildCommands } = require('./config')
const { setup: setupProduction } = require('./mode/production')
const { setup: setupDevelopment } = require('./mode/development')
const { setupRouting } = require('./routing')
const { ensureConfigFile, ejectBlueprint } = require('./setup')
const { kEmitter, kOptions } = require('./symbols')

class Vite {
  constructor (scope, options) {
    this.scope = scope
    this.setupMode = options.dev ? setupDevelopment : setupProduction
    this.setupRouting = setupRouting
    this[kOptions] = options    
    this[kEmitter] = new EventEmitter()    
  }

  async ready () {
    this.config = await configure(this[kOptions])
    this.setupRouting(await this.setupMode(this.config))
  }

  get (url, routeOptions) {
    return this.route(url, { method: 'GET', ...routeOptions })
  }

  post (url, { data, method, ...routeOptions } = {}) {
    return this.route(url, { data, method: 'POST', ...routeOptions })
  }
}

function fastifyVite (scope, options, done) {
  scope.decorate('vite', new Vite(scope, options))
  done()
}

module.exports = fp(fastifyVite)
module.exports.ensureConfigFile = ensureConfigFile
module.exports.ejectBlueprint = ejectBlueprint
module.exports.resolveBuildCommands = resolveBuildCommands
module.exports.default = module.exports
