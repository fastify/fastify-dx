import { getPages } from 'fastify-dx'

export default getPages({
  globs: import.meta.glob('/pages/**/*.jsx'),
  param: /\\$(\w+)/,
})
