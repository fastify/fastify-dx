import { getRoutes, hydrateRoutes } from './core'

export default import.meta.env.SSR
  ? () => getRoutes(import.meta.globEager('/**/*.vue'))
  : () => getRoutes(hydrateRoutes(import.meta.glob('/**/*.vue')))
