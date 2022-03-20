import Fastify from 'fastify'

console.log('Hello from test')

const app = Fastify({ logger: true })

await app.listen(3000)
