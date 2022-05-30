import { 
  createRoutes, 
  hydrateRoutes
} from 'fastify-dx-react/routes'

export default import.meta.env.SSR
  ? createRoutes(import.meta.globEager('/pages/**/*.jsx'))
  : hydrateRoutes(import.meta.glob('/pages/**/*.jsx'))
