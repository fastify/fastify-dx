import Head from 'unihead/client'
import { render, hydrate } from 'solid-js/web'

import create from '/dx:create.tsx'
import routesPromise from '/dx:routes.js'

mount('main')

async function mount (target) {
  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  const context = await import('/dx:context.js')
  const serverRoute = await extendContext(window.route, context)
  const head = new Head(window.route.head, window.document)
  const resolvedRoutes = await routesPromise
  const routeMap = Object.fromEntries(
    resolvedRoutes.map((route) => [route.path, route]),
  )
  const app = create({
    payload: {
      head,
      serverRoute,
      routes: window.routes,
      routeMap,
    },
  })
  if (serverRoute.clientOnly) {
    render(() => app, target)
  } else {
    hydrate(() => app, target)
  }
}

async function extendContext (ctx, {
  // The route context initialization function
  default: setter,
  // We destructure state here just to discard it from extra
  state,
  // Other named exports from context.js
  ...extra
}) {
  Object.assign(ctx, extra)
  if (setter) {
    await setter(ctx)
  }
  return ctx
}
