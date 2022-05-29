import Head from 'unihead'

// Helpers from the Node.js stream library to
// make it easier to work with renderToPipeableStream()
import { Readable, PassThrough } from 'node:stream'

// Helpers from the Node.js stream library to
// make it easier to work with renderToPipeableStream()
import { onAllReady, onShellReady } from 'fastify-dx-react/readable.js'

// React 18's preferred server-side rendering function,
// which enables the combination of React.lazy() and Suspense
import { renderToPipeableStream } from 'react-dom/server'

// fastify-vite's minimal HTML templating function,
// which extracts interpolation variables from comments
// and returns a function with the generated code
import { createHtmlTemplateFunction } from 'fastify-vite'

// Used to safely serialize JavaScript into
// <script> tags, preventing a few types of attack
import devalue from 'devalue'

// The fastify-vite renderer overrides
export default {
  async prepareClient ({ routes, ...others }) {
    routes = await routes
    return { routes, ...others }
  },
  createHtmlFunction,
  createRenderFunction,
  createRouteHandler,
  createRoute,
}

class RouteContext {
  constructor (server, req, reply, route, client) {
    this.server = server
    this.req = req
    this.reply = reply
    this.head = {}
    this.data = route.data
    this.streaming = route.streaming
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

export function createRouteHandler (client, scope, config) {
  return function (req, reply) {
    reply.html(reply.render(req))
  }
}

const hydrationTarget = 'window.route'

// The return value of this function gets registered as reply.html()
export function createHtmlFunction (source, scope, config) {
  // Templating functions for universal rendering (SSR+CSR)
  const [unHeadSource, unFooterSource] = source.split('<!-- element -->')
  const unHeadTemplate = createHtmlTemplateFunction(unHeadSource)
  const unFooterTemplate = createHtmlTemplateFunction(unFooterSource)
  // Templating functions for server-only rendering (SSR only)
  const [soHeadSource, soFooterSource] = source
    // Unsafe if dealing with user-input, but safe here 
    // where we control the index.html source
    .replace(/<script[^>]+type="module"[^>]+>.*?<\/script>/g, '')
    .split('<!-- element -->')
  const soHeadTemplate = createHtmlTemplateFunction(soHeadSource)
  const soFooterTemplate = createHtmlTemplateFunction(soFooterSource)
  // This function gets registered as reply.html()
  return function ({ routes, context, body }) {
    // Decide which templating functions to use, with and without hydration
    const headTemplate = context.serverOnly ? soHeadTemplate : unHeadTemplate
    const footerTemplate = context.serverOnly ? soFooterTemplate : unFooterTemplate
    // Decide whether or not to include the hydration script
    const hydration = context.serverOnly
      ? ''
      : (
        '<script>\n' +
        `${hydrationTarget} = ${devalue(context.toJSON())}\n` +
        `window.routes = ${devalue(routes.toJSON())}\n` +
        '</script>'
      )
    // Render page-level <head> elements
    const head = new Head(context.head).render()
    // Create readable stream with prepended and appended chunks 
    const readable = Readable.from(generateHtmlStream({
      body: body && (
        context.streaming
          // For reasons beyond my understanding, 
          // renderToPipeableStream() cannot be imported 
          // from within a library so it's passed along here
          ? onShellReady(renderToPipeableStream, body) 
          : onAllReady(renderToPipeableStream, body)
      ),
      head: headTemplate({ ...context, head, hydration }),
      footer: footerTemplate(context),
    }))
    // Send out header and readable stream with full response
    this.type('text/html')
    this.send(readable)
  }
}

function createRenderFunction ({ routes, create }) {
  // create is exported by client/index.js
  return function (req) {
    req.route.data = {
      todoList: [
        'Do laundry',
        'Respond to emails',
        'Write report',
      ],
    }
    // Creates main React component with all the SSR context it needs
    const app = !req.route.clientOnly && create(routes, req.route, req.url)
    // Perform SSR, i.e., turn app.instance into an HTML fragment
    // The SSR context data is passed along so it can be inlined for hydration
    return { routes, context: req.route, body: app }
  }
}

// Helper function to prepend and append chunks the body stream
export async function * generateHtmlStream ({ head, body, footer }) {
  yield head
  if (body) {
    for await (const chunk of await body) {
      yield chunk
    }
  }
  yield footer
}

export function createRoute ({ client, handler, errorHandler, route }, scope, config) {
  if (route.getData) {
    // If getData is provided, register JSON endpoint for it
    scope.get(`/-/data${route.path}`, async (req, reply) => {
      reply.send(await route.getData())
    })
  }
  scope.get(route.path, {
    onRequest (req, reply, done) {
      req.route = new RouteContext(scope, req, reply, route, client)
      done()
    },
    // If getData is provided,
    // make sure it runs before the SSR route handler
    // ...route.getData && {
    //   async preHandler (req, reply) {
    //     req.route.data = await route.getData()
    //   },
    // },
    handler,
    errorHandler,
    ...route,
  })
}

