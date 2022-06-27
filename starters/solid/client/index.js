// SSR functions from Solid
import { renderToStream, renderToStringAsync } from 'solid-js/web'

import create from '/dx:create.jsx'
import routes from '/dx:routes.js'
import * as context from '/dx:context.js'

export default {
  // Solid requires renderToStream to be imported
  // from the same module environment where all
  // application-level code runs
  renderToStream,
  renderToStringAsync,
  // Exports required by Fastify DX itself
  create,
  routes,
  context,
}
