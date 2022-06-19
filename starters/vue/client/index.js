import routes from '/dx:routes.js'
import create from '/dx:create.js'

export default { 
  context: await import('/dx:context.js'), 
  routes,
  create,
}
