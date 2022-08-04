import Fastify from 'fastify'
import FastifyVite from 'fastify-vite'
import FastifyDXReact from 'fastify-dx-react'

const server = Fastify()

server.decorate('db', {
  todoList: [
    'Do laundry',
    'Respond to emails',
    'Write report',
  ],
})

server.put('/api/todo/items', (req, reply) => {
  server.db.todoList.push(req.body.item)
  reply.send({ ok: true })
})

server.delete('/api/todo/items', (req, reply) => {
  server.db.todoList.splice(req.body.index, 1)
  reply.send({ ok: true })
})

await server.register(FastifyVite, {
  root: import.meta.url,
  renderer: FastifyDXReact,
})

await server.vite.ready()

await server.listen(3000)
