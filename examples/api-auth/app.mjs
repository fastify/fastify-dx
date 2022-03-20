
// Automatically register the fastify-jwt plugin
export const jwt = { secret: 'superscret ' }

// Automatically adds onRequest hook
export async function onRequest (req, reply) {
  await req.jwtVerify()
}

export default (app) => {
  app.post('/signup', (req, reply) => {
    const token = app.jwt.sign({ payload })
    reply.send({ token })
  })
  app.get('/', (req, reply) => {
    req.send(req.user)
  })
}
