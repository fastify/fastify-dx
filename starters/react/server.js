import Fastify from 'fastify'
import FastifyVite from 'fastify-vite'
import FastifyDXReact from 'fastify-dx-react'

const server = Fastify()

server.decorate('db', {
  todoList: [
    'Do laundry',
    'Respond to emails',
    'Write report',
  ]
})

await server.register(FastifyVite, { 
  root: import.meta.url, 
  renderer: FastifyDXReact,
  clientModule: '/client.js',
})

await server.vite.ready()

await server.listen(3000)
