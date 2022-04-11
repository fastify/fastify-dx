
function setupRouting ({ handler, routes }) {
  const _getRouteSetter = this.config.renderer.getRouteSetter ?? getRouteSetter
  this.route = _getRouteSetter(this.scope, handler)
  for (const route of routes) {
    this.route(route.path, route)
  }
  function getRouteSetter (scope, handler) {
    return (url, routeOptions = {}) => {
      scope.route({ url, handler, method: 'GET', ...routeOptions })
    }
  }
}

module.exports = { setupRouting }
