import { PassThrough } from 'stream'
import { renderToPipeableStream } from 'react-dom/server'

export { Readable } from 'stream'

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
