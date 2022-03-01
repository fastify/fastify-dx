const { on, EventEmitter } = require('events')

const vite = require('vite')
const FastifyPlugin = require('fastify-plugin')

const Options = require('./options')

const setupProduction = require('./production')
const setupDev = require('./dev')
const setupRouting = require('./routing')

const { kEmitter } = require('./symbols')

class Vite {
  constructor (scope, options) {
    this[kEmitter] = new EventEmitter()
    this.options = new Options(options)
    if (this.options.dev) {
      setupDev.call(this, scope, options)
    } else {
      setupProduction.call(this, scope, options)
    }
  }
  async ready () {
    setupRouting.call(this, await on('ready', this[kEmitter]))
  }
}

function fastifyVite (scope, options, done) {
  fastify.decorate('vite', new Vite(options))
  done()
}

module.exports = FastifyPlugin(fastifyVite)
