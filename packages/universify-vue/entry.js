const { resolve } = require('path')

function getDevelopmentEntry (options, vite) {
  const modulePath = resolve(root, options.entry.server.replace(/^\/+/, ''))
  const { routes } = entryModule.default || entryModule
  return {
    routes,
    async render () {
      const entryModule = await vite.ssrLoadModule(modulePath)
      const { render } = entryModule.default || entryModule
      return render
    },
  }
}

function getProductionEntry (options, vite) {
    // Load production template source only once in prod
    const serverBundle = require(resolve(this.options.distDir, 'server/server.cjs'))
    const { routes, render } = serverBundle.default ?? serverBundle
    this[kRoutes] = routes
    this[kRender] = render
  }
  async getRoutes () {
    return this[kRoutes] === 'function'
      ? await this[kRoutes]
      : this[kRoutes]
  }
  async getRenderFunction () {
    return this[kRender] === 'function'
      ? await this[kRender]
      : this[kRender]
  }
}
