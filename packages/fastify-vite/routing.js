
function getRouteSetter (scope, handler) {
  return (url, routeOptions) => {
    scope.route({ url, handler, ...routeOptions })
  }
}

module.exports = function (scope, options, { handler, routes }) {
  options.getRouteSetter ??= getRouteSetter
  this.route = options.getRouteSetter(scope, options)
  for (const route of routes) {
    this.route(route.path, route)
  }
}
