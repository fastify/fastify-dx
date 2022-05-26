import { BrowserRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server'

import { createRoot, hydrateRoot } from 'react-dom/client'

export function getRouter (isServer) {
  return isServer ? StaticRouter : BrowserRouter
}

export function mount (createApp, element, ctx) {
  if (ctx.clientOnly) {
    createRoot(element).render(createApp(ctx))
  } else {
    hydrateRoot(element, createApp(ctx))
  }
}
