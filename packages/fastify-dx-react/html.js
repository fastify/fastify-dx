import devalue from 'devalue'
import { createHtmlTemplateFunction as createTemplate } from 'fastify-vite'
import { Readable } from './stream.js'

const hydrationTarget = 'window.route'

export function createStreamHtmlFunction (streamer, source, scope, config) {
  const target = config.hydrationTarget ?? hydrationTarget
  const [headSource, postBodySource] = source.split('<!-- element -->')
  const serverOnlyHeadSource = source.replace(/<script>.*?<\/script>/, '')
  const headTemplate = createTemplate(headSource)
  const serverOnlyHeadTemplate = createTemplate(serverOnlyHeadSource)
  const postBodyTemplate = createTemplate(postBodySource)
  return (reply, { context, head, stream }) => {
    // console.log(stream)
    // const hydration = context.serverOnly
    //   ? ''
    //   : `<script>${target} = ${devalue(context.toJSON())}</script>`
    // const readable = generateHtmlStream({
    //   head: context.serverOnly
    //     ? serverOnlyHeadTemplate({ hydration, ...context, head })
    //     : headTemplate({ hydration, ...context, head }),
    //   body: streamer(stream),
    //   postBody: postBodyTemplate(context),
    // })
    streamer(stream).then(readable => reply.raw.pipe(readable))
    return reply
    // reply.send(Readable.from(readable))
  }
}
