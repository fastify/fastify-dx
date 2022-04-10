const fp = require('fastify-plugin')

const { ensureConfigFile, ejectBlueprint } = require('./setup')
const { configure, resolveBuildCommands } = require('./config')
const { setup: setupProduction } = require('./mode/production')
const { setup: setupDevelopment } = require('./mode/development')
const { setupRouting } = require('./routing')

class Vite {
  kOptions = Symbol('kOptions')
  constructor (scope, options) {
    this.scope = scope
    this.setupMode = options.dev ? setupDevelopment : setupProduction
    this.setupRouting = setupRouting
    this[Vite.kOptions] = options
  }

  async ready () {
    this.config = await configure(this[Vite.kOptions])
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
