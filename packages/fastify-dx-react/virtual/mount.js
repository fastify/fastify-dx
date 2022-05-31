import mount from 'fastify-dx-react/mount'

import create from '/base.jsx'
import routes from 'dx:routes'

mount('main', { create, routes })
