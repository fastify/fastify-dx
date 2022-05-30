import { createRoot, hydrateRoot } from 'react-dom/client'

export default async function mount (target, { create, routes: routesPromise }) {
  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  const resolvedRoutes = await routesPromise
  if (window.route.clientOnly) {
    createRoot(target).render(create(resolvedRoutes, window.route))
  } else {
    hydrateRoot(target, create(resolvedRoutes, window.route))
  }
}
