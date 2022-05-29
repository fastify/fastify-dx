import create from './base.jsx'
import routes from './routes.js'

export default {
  // Provides client-side navigation routes to server
  routes,
  // Provides function needed to perform SSR
  create,
  // Shorthand for including stylesheets above the fold
  styles: ['./base.css']
}
