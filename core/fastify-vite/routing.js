function get (url, routeOptions) {
  return this.route(url, { method: 'GET', ...routeOptions })
}

function post (url, { data, method, ...routeOptions } = {}) {
  return this.route(url, { data, method: 'GET', ...routeOptions })
}

function route (url, routeOptions) {
  const preHandler = routeOptions.preHandler || []
  if (routeOptions.getData) {
    preHandler.push(getData)
  }
  if (routeOptions.getPayload) {
    preHandler.push(getPayload)
    fastify.get(`/-/payload${url}`, getPayloadHandler)
  }
  fastify.route({ ...routeOptions, preHandler })
}

module.exports = {
  get,
  post,
  route,
}

async function getData (req, reply) {
  req.data = await getData(
    {
      req,
      params: req.params,
      reply,
      $api: this.api && this.api.client,
      fastify: this,
      fetch,
    },
  )
}

async function getPayload (req, reply) {
  req.payload = await getPayload(
    {
      req,
      params: req.params,
      reply,
      $api: this.api && this.api.client,
      fastify: this,
      fetch,
    },
  )
}

async function getPayloadHandler (req, reply) {
  return getPayload({
    req,
    params: req.params,
    reply,
    $api: this.api && this.api.client,
    fastify: this,
    fetch,
  })
}
