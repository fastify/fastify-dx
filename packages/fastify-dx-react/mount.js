import { createRoot, hydrateRoot } from 'react-dom/client'

export default function mount (target, create, ctx) {
  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  if (ctx.clientOnly) {
    createRoot(target).render(create(ctx))
  } else {
    hydrateRoot(target, create(ctx))
  }
}
