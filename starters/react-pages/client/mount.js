import mount from 'fastify-dx-react/mount.js'
import create from '/base.jsx'

mount('main', create(window.route))
