import Fastify from 'fastify'
import FastifyVite from '@fastify/vite'
import FastifyVue from '@fastify/vue'

const server = Fastify()

server.decorate('db', {
  todoList: [
    'Do laundry',
    'Respond to emails',
    'Write report',
  ]
})

server.put('/api/todo/items', (req, reply) => {
  server.db.todoList.push(req.body)
  reply.send({ ok: true })
})

server.delete('/api/todo/items', (req, reply) => {
  server.db.todoList.splice(req.body, 1)
  reply.send({ ok: true })
})

await server.register(FastifyVite, { 
  root: import.meta.url, 
  renderer: FastifyVue,
})

await server.vite.ready()

await server.listen({ port: 3000 })
