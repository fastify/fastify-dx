import { createRoot, hydrateRoot } from 'react-dom/client'

export default async function mount (target, { create, routes }) {
  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  routes = await routes
  if (window.route.clientOnly) {
    createRoot(target).render(create(routes, window.route))
  } else {
    hydrateRoot(target, create(routes, window.route))
  }
}
