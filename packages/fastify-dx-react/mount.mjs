import Head from 'unihead/client'
import { createRoot, hydrateRoot } from 'react-dom/client'

export default async function mount (target, { create, routes: routesPromise }) {
  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  const head = new Head(window.route.head, window.document)
  const resolvedRoutes = await routesPromise
  const routeMap = Object.fromEntries(routes.map((route) => {
    return [route.path, route]
  }))
  const app = create({
    head,
    initialRoute: window.route,
    routes: window.routes,
    routeMap,
  })
  if (window.route.clientOnly) {
    createRoot(target).render(app)
  } else {
    hydrateRoot(target, app)
  }
}
