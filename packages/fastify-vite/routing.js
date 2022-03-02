
function setup (scope, options, { handler, routes }) {
  const getRouteSetter = options.getRouteSetter ?? getRouteSetter
  this.route = getRouteSetter(scope, options)
  for (const route of routes) {
    this.route(route.path, route)
  }
}

module.exports = setup

function getRouteSetter (scope, handler) {
  return (url, routeOptions) => {
    scope.route({ url, handler, ...routeOptions })
  }
}
