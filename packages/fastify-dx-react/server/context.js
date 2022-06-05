import { proxy } from 'valtio'

const routeContextInspect = Symbol.for('nodejs.util.inspect.custom')

const overrideProtected = [
  'server',
  'req',
  'reply',
  'head',
  'data',
  'firstRender',
  'getData',
  'streaming',
  'clientOnly',
  'serverOnly',
]

export default class RouteContext {
  static async create (server, req, reply, route, contextInit) {
    const routeContext = new RouteContext(server, req, reply, route)
    if (contextInit?.default) {
      await contextInit.default(routeContext)
    }
    return routeContext
  }
  constructor (server, req, reply, route, context) {
    this.server = server
    this.req = req
    this.reply = reply
    this.head = {}
    this.state = null
    this.data = route.data
    this.firstRender = true
    this.getData = !!route.getData
    this.onEnter = !!route.onEnter
    this.streaming = route.streaming
    this.clientOnly = route.clientOnly
    this.serverOnly = route.serverOnly
  }

  [routeContextInspect] () {
    return {
      req: { [routeContextInspect]: () => '[Request]' },
      reply: { [routeContextInspect]: () => '[Reply]' },
      data: this.data,
      getData: this.getData,
      onEnter: this.onEnter,
      streaming: this.streaming,
      clientOnly: this.clientOnly,
      serverOnly: this.serverOnly,
    }
  }

  toJSON () {
    return {
      state: this.state,
      data: this.data,
      getData: this.getData,
      onEnter: this.onEnter,
      firstRender: this.firstRender,
      clientOnly: this.clientOnly,
    }
  }
}

RouteContext.extend = function (initial) {
  const { default: _, ...extra } = initial
  // const setterProxy = new Proxy(initial, {
  //   get: (ctx, prop) => initial[prop],
  //   set: (ctx, prop, value) => {
  //     Object.defineProperty(RouteContext.prototype, prop, value)
  //     return value
  //   }
  // })
  for (const [prop, value] of Object.entries(extra)) {
    Object.defineProperty(RouteContext.prototype, prop, value)
  }
}
