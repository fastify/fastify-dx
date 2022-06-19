
// Helper from the Node.js stream library to
// make it easier to work with renderToPipeableStream()
import { PassThrough } from 'stream'

// Helper function to prepend and append chunks the body stream
export async function * generateHtmlStream ({ head, body, stream, footer }) {
  yield head
  if (body) {
    yield body
  }
  if (stream) {
    console.log('Streaming!')
    for await (const chunk of await stream) {
      yield chunk
    }
  }
  yield footer
}
