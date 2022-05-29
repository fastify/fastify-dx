
// Helper from the Node.js stream library to
// make it easier to work with renderToPipeableStream()
import { PassThrough } from 'stream'

// Helper function to get an AsyncIterable (via PassThrough)
// from the renderToPipeableStream() onShellReady event
export function onShellReady (renderToPipeableStream, app) {
  console.log('onShellReady()')
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

// Helper function to get an AsyncIterable (via PassThrough)
// from the renderToPipeableStream() onAllReady event
export function onAllReady (renderToPipeableStream, app) {
  const duplex = new PassThrough()
  return new Promise((resolve, reject) => {
    try {
      const pipeable = renderToPipeableStream(app, {
        onAllReady () {
          resolve(pipeable.pipe(duplex))
        },
        onError (error) {
          reject(error)
        },
      })
    } catch (error) {
      resolve(error)
    }
  })
}