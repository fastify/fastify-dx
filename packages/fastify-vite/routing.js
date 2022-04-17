
function setupRouting ({ handler, routes }) {
  const _createRouteFunction = this.config.createRouteFunction ??
    this.config.renderer.createRouteFunction ??
    createRouteFunction
  this.route = _createRouteFunction(this.scope, handler)
  for (const route of routes) {
    this.route(route.path, route)
  }
  function createRouteFunction (scope, handler) {
    return (url, routeOptions = {}) => {
      scope.route({ url, handler, method: 'GET', ...routeOptions })
    }
  }
}

module.exports = { setupRouting }
