import React from 'react'
import devalue from 'devalue'
import { Readable, PassThrough } from 'node:stream'
import Head from 'unihead'
import { createHtmlTemplateFunction } from 'fastify-vite'
import { createStreamHtmlFunction } from './html.js'
import { onAllReady, onShellReady } from './stream.js'
import { renderToPipeableStream } from 'react-dom/server'

// Helper function to prepend and append chunks the body stream
async function * streamHtml (head, body, footer) {
  yield head
  // We first await on the stream being ready (onShellReady)
  // And then await on its AsyncIterator
  for await (const chunk of await body) {
    yield chunk
  }
  yield footer
}

class RouteContext {
  constructor (server, req, reply, route) {
    this.server = server
    this.req = req
    this.reply = reply
    this.head = {}
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
  createRouteHandler,
  createRoute,
}

// // The return value of this function gets registered as reply.html()
// export function createHtmlFunction (source, scope, config) {
//   const sendHtml = createStreamHtmlFunction(onAllReady, source, scope, config)
//   const streamHtml = createStreamHtmlFunction(onShellReady, source, scope, config)
//   return function html (payload) {
//     this.type('text/html')
//     if (payload.context.streaming) {
//       streamHtml(this, payload)
//     } else {
//       console.log('!')
//       sendHtml(this, payload)
//     }
//   }
// }


// The return value of this function gets registered as reply.html()
function createHtmlFunction (source, scope, config) {
  const [headSource, footer] = source.split('<!-- element -->')
  const headTemplate = createHtmlTemplateFunction(headSource)
  return function ({ stream, context }) {
    const head = headTemplate({
      hydration: `<script>window.route = ${devalue({ data: context.data })}</script>`,
    })
    this.type('text/html')
    const readable = Readable
      .from(streamHtml(head, stream, footer))
      // Errors from React SSR can be captured here
      .on('error', console.log)
    this.send(readable)
  }
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

export function createRenderFunction ({ create }) {
  // createApp is exported by client/index.js
  return function (req) {
    console.log('req.route.head', req.route.head)
    const head = new Head(req.route.head).render()
    req.route.data = { 
      todoList: [
        'Do laundry',
        'Respond to emails',
        'Write report',
      ]
    }
    console.log('req.route', req.route)
    return {
      context: req.route,
      head,
      stream: toReadable(create(req.route, req.url)),
    }
  }
}

export function createRouteHandler (client, scope, config) {
  return function (req, reply) {
    reply.html(reply.render(req))
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
    onRequest (req, reply, done) {
      req.route = new RouteContext(scope, req, reply, route)
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
