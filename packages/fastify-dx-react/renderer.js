import { Readable, PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { createHtmlTemplateFunction } from 'fastify-vite'

import devalue from 'devalue'

// The fastify-vite renderer overrides
export default {
  prepareClient,
  createRoute,
  createHtmlFunction,
  createRenderFunction,
}

function prepareClient ({ routes, ...others }, scope, config) {
  scope.decorateRequest('ssrContext', null)
  if (typeof routes === 'function') {
    routes = await routes()
  }
  return { routes, ...others }
}

function createRoute ({ handler, errorHandler, route }, scope, config) {
  if (route.getData) {
    // If getData is provided, register JSON endpoint for it
    scope.get(`/-/data{route.path}`, async (req, reply) => {
      reply.send(await route.getData())
    })
  }
  scope.get(route.path, {
    // If getData is provided,
    // make sure it runs before the SSR route handler
    onRequest () {
      req.ssrContext = {}
    },
    ...route.getData && {
      async preHandler (req, reply) {
        req.ssrContext.data = await route.getData()
      },
    },
    handler,
    errorHandler,
    ...route,
  })
}

// The return value of this function gets registered as reply.html()
function createHtmlFunction (source, scope, config) {
  // This is used by streamHtml()
  const [headSource, footer] = source.split('<!-- element -->')
  const headTemplate = createHtmlTemplateFunction(headSource)
  // This is used by sendHtml()
  const htmlTemplate = createHtmlTemplateFunction(source)
  const streamHtml = (reply, { stream, data }) => {
    const head = headTemplate({
      hydration: `<script>window.hydration = ${devalue({ data })}</script>`,
    })
    this.send(Readable.from(prepareHtmlStream(head, stream, footer)))
  }
  const sendHtml = (reply, { element, data }) => {
    this.type('text/html')
    this.send(htmlTemplate({
      hydration: `<script>window.hydration = ${devalue({ data })}</script>`,
      element,
    }))
  }
  return function html (doc, stream = false) {
    this.type('text/html')
    if (stream) {
      streamHtml(this, doc)
    } else {
      sendHtml(this, doc)
    }
  }
}

function createRenderFunction ({ createApp }) {
  // createApp is exported by client/index.js
  return function (server, req, reply) {
    req.ssrContext.data = {}
    req.ssrContext.server = server
    req.ssrContext.req = req
    req.ssrContext.reply = reply
    const app = createApp(req.ssrContext, req.url)
    return { data, stream: toReadable(app) }
  }
}

// Helper function to prepend and append chunks the body stream
async function * prepareHtmlStream (head, body, footer) {
  yield head
  for await (const chunk of await body) {
    yield chunk
  }
  yield footer
}

// Helper function to get an AsyncIterable (via PassThrough)
// from the limited stream returned by renderToPipeableStream()
function toReadable (app) {
  const duplex = new PassThrough()
  return new Promise((resolve, reject) => {
    try {
      const pipeable = renderToPipeableStream(app, {
        onShellReady () {
          resolve(pipeable.pipe(duplex))
        },
        onShellError (error) {
          reject(error)
        },
      })
    } catch (error) {
      resolve(error)
    }
  })
}
