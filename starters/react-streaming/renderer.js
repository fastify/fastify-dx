import Head from 'unihead'
import { 
  prepareClient,
  createHtmlFunction,
  createRouteHandler,
  createRoute
} from 'fastify-dx-react'

// The fastify-vite renderer overrides
export default {
  prepareClient,
  createHtmlFunction,
  createRenderFunction,
  createRouteHandler,
  createRoute,
}

function createRenderFunction ({ routes, create }) {
  // create is exported by client/index.js
  return function (req) {
    // Creates main React component with all the SSR context it needs
    const app = !req.route.clientOnly && create(routes, req.route, req.url)
    // Perform SSR, i.e., turn app.instance into an HTML fragment
    // The SSR context data is passed along so it can be inlined for hydration
    return { routes, context: req.route, body: app }
  }
}
