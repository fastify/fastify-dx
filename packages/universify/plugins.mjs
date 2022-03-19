export default {
  // https://github.com/fastify/fastify-accepts#readme
  // https://github.com/fastify/fastify-csrf#readme
  // https://github.com/fastify/fastify-cors#readme
  // https://github.com/fastify/fastify-cookie#readme
  // https://github.com/fastify/fastify-compress#readme
  compress: () => importModule('fastify-compress'),
  // https://github.com/fastify/fastify-helmet#readme
  // https://github.com/fastify/fastify-jwt
  jwt: () => importModule('fastify-jwt'),
  // https://github.com/fastify/fastify-static
  static: () => importModule('fastify-static'),
  // https://github.com/fastify/fastify-postgres
  postgresql: () => importModule('fastify-postgres'),
  // https://github.com/fastify/fastify-mongodb
  mongodb: () => importModule('fastify-mongodb'),
  // https://github.com/fastify/point-of-view
  templates: () => importModule('point-of-view'),
  // https://github.com/fastify/fastify-redis#readme
  redis: () => importModule('fastify-redis'),
  // https://github.com/fastify/fastify-nextjs
  nextjs: () => importModule('fastify-nextjs'),
  // https://github.com/smartiniOnGitHub/fastify-healthcheck
  health: () => importModule('fastify-healthcheck'),
  // https://github.com/fastify/under-pressure
  pressure: () => importModule('under-pressure'),
  // https://github.com/heply/fastify-bcrypt
  bcrypt: () => importModule('fastify-bcrypt'),
}

function importModule (plugin) {
  const m = await import(plugin)
  return m.default ?? m
}
