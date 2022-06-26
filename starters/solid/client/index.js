// SSR functions from Solid
import { renderToStream } from 'solid-js/web'
import create from '/dx:create.jsx'
import routes from '/dx:routes.js'
import * as context from '/dx:context.js'

export default { 
  renderToStream,
  create,
  routes,
  context,
}
