import devalue from 'devalue'
import { createHtmlTemplateFunction as createTemplate } from 'fastify-vite'
import { generateHtmlStream, Readable } from './stream.js'

const hydrationTarget = 'window.route'

export function createStreamHtmlFunction (streamer, source, scope, config) {
  const target = config.hydrationTarget ?? hydrationTarget
  const [headSource, postBodySource] = source.split('<!-- element -->')
  const serverOnlyHeadSource = source.replace(/<script>.*?<\/script>/, '')
  const headTemplate = createTemplate(headSource)
  const serverOnlyHeadTemplate = createTemplate(serverOnlyHeadSource)
  const postBodyTemplate = createTemplate(postBodySource)
  return (reply, { context, head, stream }) => {
    const hydration = context.serverOnly
      ? ''
      : `<script>${target} = ${devalue(context)}</script>`
    const readable = generateHtmlStream({
      head: context.serverOnly
        ? serverOnlyHeadTemplate({ head, hydration, ...context })
        : headTemplate({ head, hydration, ...context }),
      body: streamer(stream),
      postBody: postBodyTemplate(context),
    })
    reply.send(Readable.from(readable))
  }
}
