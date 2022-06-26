// Used to send a readable stream to reply.send()
import { Readable, PassThrough } from 'stream'

// fastify-vite's minimal HTML templating function,
// which extracts interpolation variables from comments
// and returns a function with the generated code
import { createHtmlTemplateFunction } from 'fastify-vite'

// Used to safely serialize JavaScript into
// <script> tags, preventing a few types of attack
import devalue from 'devalue'

// Small SSR-ready library used to generate
// <title>, <meta> and <link> elements
import Head from 'unihead'

// SSR functions from Solid
import { 
  renderToStream, 
  renderToStringAsync, 
  generateHydrationScript
} from 'solid-js/web'

// Helper to build a stream from multiple fragments
import { generateHtmlStream } from './server/stream.js'

// Holds the universal route context
import RouteContext from './server/context.js'

export default {
  prepareClient,
  createHtmlFunction,
  createRenderFunction,
  createRouteHandler,
  createRoute,
}

export async function prepareClient ({
  routes: routesPromise,
  context: contextPromise,
  ...others
}) {
  const context = await contextPromise
  const resolvedRoutes = await routesPromise
  return { context, routes: resolvedRoutes, ...others }
}

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
  const hydrationScript = generateHydrationScript()
  // This function gets registered as reply.html()
  return function ({ routes, context, stream, body }) {
    // Initialize hydration, which can stay empty if context.serverOnly is true
    let hydration = ''
    // Decide which templating functions to use, with and without hydration
    const headTemplate = context.serverOnly ? soHeadTemplate : unHeadTemplate
    const footerTemplate = context.serverOnly ? soFooterTemplate : unFooterTemplate
    // Decide whether or not to include the hydration script
    if (!context.serverOnly) {
      hydration = (
        '<script>\n' +
        `window.route = ${devalue(context.toJSON())}\n` +
        `window.routes = ${devalue(routes.toJSON())}\n` +
        '</script>'
      )
    }
    // Render page-level <head> elements
    const head = new Head(context.head).render()
    // Create readable stream with prepended and appended chunks
    const readable = Readable.from(generateHtmlStream({
      stream,
      body,
      head: headTemplate({ ...context, head, hydration, hydrationScript }),
      footer: footerTemplate(context),
    }))
    // Send out header and readable stream with full response
    this.type('text/html')
    this.send(readable)
  }
}

export async function createRenderFunction ({ routes, create }) {
  // Convenience-access routeMap
  const routeMap = Object.fromEntries(
    routes.toJSON().map(route => [route.path, route])
  )
  return async function (req) {
    let stream = null
    let body = null
    if (!req.route.clientOnly) {
      // Creates main Solid component with all the SSR context it needs
      const app = create({
        url: req.url,
        payload: {
          routes,
          routeMap,
          serverRoute: req.route,
        },
      })
      if (req.route.streaming) {
        console.log('streaming enabled')
        const duplex = new PassThrough()
        renderToStream(app).pipe(duplex)
        stream = duplex
      } else {
        body = await renderToStringAsync(app)
      }
    }
    // Perform SSR, i.e., turn app.instance into an HTML fragment
    // The SSR context data is passed along so it can be inlined for hydration
    return { 
      routes, 
      context: req.route, 
      stream,
      body,
    }
  }
}

export function createRouteHandler (client, scope, config) {
  return async function (req, reply) {
    reply.html(await reply.render(req))
    return reply
  }
}

export function createRoute ({ client, handler, errorHandler, route }, scope, config) {
  const onRequest = async function onRequest (req, reply) {
    req.route = await RouteContext.create(
      scope,
      req,
      reply,
      route,
      client.context,
    )
  }
  if (route.getData) {
    // If getData is provided, register JSON endpoint for it
    scope.get(`/-/data${route.path}`, {
      onRequest,
      async handler (req, reply) {
        reply.send(await route.getData(req.route))
      },
    })
  }

  // See https://github.com/fastify/fastify-dx/blob/main/URMA.md
  const hasURMAHooks = Boolean(
    route.getData || route.getMeta || route.onEnter,
  )

  // Extend with route context initialization module
  RouteContext.extend(client.context)

  scope.get(route.path, {
    onRequest,
    // If either getData or onEnter are provided,
    // make sure they run before the SSR route handler
    ...hasURMAHooks && {
      async preHandler (req, reply) {
        try {
          if (route.getData) {
            req.route.data = await route.getData(req.route)
          }
          if (route.getMeta) {
            req.route.head = await route.getMeta(req.route)
          }
          if (route.onEnter) {
            if (!req.route.data) {
              req.route.data = {}
            }
            const result = await route.onEnter(req.route)
            Object.assign(req.route.data, result)
          }
        } catch (err) {
          if (config.dev) {
            console.error(err)
          }
          req.route.error = err
        }
      },
    },
    handler,
    errorHandler,
    ...route,
  })
}
