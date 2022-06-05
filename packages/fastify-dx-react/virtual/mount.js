import { proxy } from 'valtio'
import Head from 'unihead/client'
import { createRoot, hydrateRoot } from 'react-dom/client'

import create from '/dx:base.jsx'
import routesPromise from '/dx:routes'

mount('main')

async function mount (target) {
  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  const context = await import('/dx:context')
  const ctxHydration = await extendContext(window.route, context)
  const head = new Head(window.route.head, window.document)
  const resolvedRoutes = await routesPromise
  const routeMap = Object.fromEntries(resolvedRoutes.map((route) => {
    return [route.path, route]
  }))
  
  const app = create({
    head,
    ctxHydration,
    routes: window.routes,
    routeMap,
  })
  if (ctxHydration.clientOnly) {
    createRoot(target).render(app)
  } else {
    hydrateRoot(target, app)
  }
}

async function extendContext (ctx, { default: setter, ...extra }) {
  Object.assign(ctx, extra)
  if (setter) {
    await setter(ctx)
  }
  return ctx
}