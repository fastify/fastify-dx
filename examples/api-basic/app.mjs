
export function onRequest (req, _, done) {
  console.log('Got a request!')
  done()
}

export const decorateReply = {
  sendHelloWorld () {
    this.send({ message: 'Hello world!' })
  },
}

export default (app) => {
  app.get('/api/example', (req, reply) => {
    reply.send({
      message: 'Hello world!',
    })
  })
  app.get('/api/hello-decorator', (req, reply) => {
    reply.sendHelloWorld()
  })
}
