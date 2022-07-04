// SSR functions from Solid
import { renderToStream, renderToString } from 'solid-js/web'

import create from '/dx:create.jsx'
import routes from '/dx:routes.js'
import * as context from '/dx:context.js'

export default {
  // Solid requires SSR functions to be imported
  // from the same module environment where all
  // application-level code runs
  renderToStream,
  renderToString,
  // Exports required by Fastify DX itself
  create,
  routes,
  context,
}
