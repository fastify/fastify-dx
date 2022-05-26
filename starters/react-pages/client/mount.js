import '/base.css'

import mount from 'fastify-dx-react/mount'
import create from '/base.jsx'

mount(
  document.querySelector('main'),
  create(window.route),
)
