import Fastify from 'fastify'
import FastifyVite from '@fastify/vite'
import FastifySolid from '@fastify/solid'

const server = Fastify()

await server.register(FastifyVite, { 
  root: import.meta.url, 
  renderer: FastifySolid,
})

await server.vite.ready()

server.decorate('db', {
  todoList: [
    'Do laundry',
    'Respond to emails',
    'Write report',
  ]
})

server.put('/api/todo/items', (req, reply) => {
  server.db.todoList.push(req.body.item)
  reply.send({ ok: true })
})

server.delete('/api/todo/items', (req, reply) => {
  server.db.todoList.splice(req.body.index, 1)
  reply.send({ ok: true })
})

await server.listen({ port: 3000 })
