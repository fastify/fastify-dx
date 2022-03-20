async function main () {
  const fastify = require('fastify')()
  await fastify.register(require('./index'))

  fastify.apply({
    after (fastify) {
      fastify.get('/*', (req, reply) => {
        reply.send('/* route properly registered')
      })
    },
    decorate: {
      someHelper () {
        return 'something'
      },
    },
    decorateRequest: {
      foobar: 'something else',
      dynamic: null,
    },
    async onRequest (req, reply) {
      req.dynamic = this.someHelper()
      reply.header('x-hello-1', `Hello from hooks: ${req.foobar} - ${req.dynamic}`)
    },
    preHandler: [
      async (req, reply) => {
        reply.header('x-hello-2', 'Hello from the first preHandler')
      },
      async (req, reply) => {
        reply.header('x-hello-3', 'Hello from the second preHandler')
      },
    ],
    before (fastify) {
      fastify.get('/before', (req, reply) => {
        reply.send('/before route properly registered')
      })
    },
  })

  return fastify
}

// TODO turn into an actual test
main().then(fastify => fastify.listen(3000, (_, addr) => {
  console.log('Listening at localhost:3000')
}))
