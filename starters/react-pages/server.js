import Fastify from 'fastify'
import FastifyVite from 'fastify-vite'
import FastifyDXReact from 'fastify-dx-react'

const server = Fastify()

await server.register(FastifyVite, {
  root: import.meta.url,
  renderer: FastifyDXReact,
})

await server.vite.ready()
await server.listen(3000)
