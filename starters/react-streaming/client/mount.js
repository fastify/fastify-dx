import mount from 'fastify-dx-react/mount.js'
import create from './base.jsx'
import routes from './routes.js'

mount('main', { create, routes })
