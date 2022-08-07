declare module 'fastify' {
  export interface FastifyInstance {
    vite: object
    db: object
  }
}
