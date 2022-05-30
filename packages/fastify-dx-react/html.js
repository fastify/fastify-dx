// Used to send a readable stream to reply.send()
import { Readable } from 'stream'

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

// Helpers from the Node.js stream library to
// make it easier to work with renderToPipeableStream()
import { onAllReady, onShellReady } from './readable.js'

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
      body: body && (
        context.streaming
          ? onShellReady(body)
          : onAllReady(body)
      ),
      head: headTemplate({ ...context, head, hydration }),
      footer: footerTemplate(context),
    }))
    // Send out header and readable stream with full response
    this.type('text/html')
    this.send(readable)
  }
}

// Helper function to prepend and append chunks the body stream
async function * generateHtmlStream ({ head, body, footer }) {
  yield head
  if (body) {
    for await (const chunk of await body) {
      yield chunk
    }
  }
  yield footer
}
