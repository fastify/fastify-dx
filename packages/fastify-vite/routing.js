
function setupRouting ({ handler, routes }) {
  const _getRouteSetter = this.config.renderer.getRouteSetter ?? getRouteSetter
  this.route = _getRouteSetter.call(this)
  for (const route of routes) {
    this.route(route.path, route)
  }
  function getRouteSetter () {
    return (url, routeOptions) => {
      this.scope.route({ url, handler, method: 'GET', ...routeOptions })
    }
  }
}

module.exports = { setupRouting }
