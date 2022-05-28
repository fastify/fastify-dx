import { createStreamHtmlFunction } from './html.js'
import { onAllReady, onShellReady } from './stream.js'

class RouteContext {
  constructor (server, req, reply, route) {
    this.server = server
    this.req = req
    this.reply = reply
    this.data = route.data
    this.static = route.static
    this.streaming = this.static ? false : route.streaming
    this.clientOnly = route.clientOnly
    this.serverOnly = route.serverOnly
  }

  toJSON () {
    return {
      data: this.data,
      static: this.static,
      clientOnly: this.clientOnly,
    }
  }
}

export default {
  createHtmlFunction,
  createRenderFunction,
  createRoute,
}

// The return value of this function gets registered as reply.html()
export function createHtmlFunction (source, scope, config) {
  const sendHtml = createStreamHtmlFunction(onAllReady, source, scope, config)
  const streamHtml = createStreamHtmlFunction(onShellReady, source, scope, config)
  return function html (payload) {
    this.type('text/html')
    if (payload.context.streaming) {
      streamHtml(this, payload)
    } else {
      sendHtml(this, payload)
    }
  }
}

export function createRenderFunction ({ createApp }) {
  // createApp is exported by client/index.js
  return function (req) {
    return {
      context: req.route,
      stream: createApp(req.route, req.url),
    }
  }
}

export function createRoute ({ handler, errorHandler, route }, scope, config) {
  if (route.getData) {
    // If getData is provided, register JSON endpoint for it
    scope.get(`/-/data${route.path}`, async (req, reply) => {
      reply.send(await route.getData())
    })
  }
  scope.get(route.path, {
    // If getData is provided,
    // make sure it runs before the SSR route handler
    onRequest (req, reply, done) {
      req.route = new RouteContext(scope, req, reply, route)
      done()
    },
    ...route.getData && {
      async preHandler (req, reply) {
        req.route.data = await route.getData()
      },
    },
    handler,
    errorHandler,
    ...route,
  })
}
