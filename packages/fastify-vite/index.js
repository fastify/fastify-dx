const { on, EventEmitter } = require('events')

const vite = require('vite')
const FastifyPlugin = require('fastify-plugin')

const processOptions = require('./options')
const setupProduction = require('./production')
const setupDev = require('./dev')
const setupRouting = require('./routing')

const { kEmitter } = require('./symbols')

class Vite {
  constructor (scope, options) {
    this[kEmitter] = new EventEmitter()
    this.options = processOptions(options)
    if (this.options.dev) {
      setupDev.call(this, scope, options)
    } else {
      setupProduction.call(this, scope, options)
    }
  }
  async ready () {
    setupRouting.call(this, scope, await on('ready', this[kEmitter]))
  }
  get (url, routeOptions) {
    return this.route(url, { method: 'GET', ...routeOptions })
  }
  post (url, { data, method, ...routeOptions } = {}) {
    return this.route(url, { data, method: 'GET', ...routeOptions })
  }
}

function fastifyVite (scope, options, done) {
  fastify.decorate('vite', new Vite(options))
  done()
}

module.exports = FastifyPlugin(fastifyVite)
