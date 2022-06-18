
// Helper from the Node.js stream library to
// make it easier to work with renderToPipeableStream()
import { PassThrough } from 'stream'

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
