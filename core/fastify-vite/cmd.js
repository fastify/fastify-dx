const fastifyCommands = require('fastify-commands')

const build = require('./build')
const dev = require('./dev')
const eject = require('./eject')
const generate = require('./generate')

function availableCommands (app, _, done) {
  app.register(fastifyCommands, {
    dev,
    build,
    eject,
    generate,
  })
  done()
}

module.exports = fp(fastifyCommands)
