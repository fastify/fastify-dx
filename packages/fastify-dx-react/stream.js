import { PassThrough } from 'stream'
import { renderToPipeableStream } from 'react-dom/server'

export { Readable } from 'stream'

// Helper function to prepend and append chunks the body stream
export async function * generateHtmlStream ({ head, body, footer }) {
  yield head
  for await (const chunk of await body) {
    yield chunk
  }
  yield footer
}

// Helper function to get an AsyncIterable stream from
// the onAllReady event from renderToPipeableStream()
export function onAllReady (app) {
  const duplex = new PassThrough()
  return new Promise((resolve, reject) => {
    try {
      const pipeable = renderToPipeableStream(app, {
        onAllReady () {
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

// Helper function to get an AsyncIterable stream from
// the onShellReady event from renderToPipeableStream()
export function onShellReady (app) {
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
