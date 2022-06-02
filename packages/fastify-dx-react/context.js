const routeContextInspect = Symbol.for('nodejs.util.inspect.custom')

export default class RouteContext {
  constructor (server, req, reply, route) {
    console.log('route', route)
    this.server = server
    this.req = req
    this.reply = reply
    this.head = {}
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
      data: this.data,
      getData: this.getData,
      onEnter: this.onEnter,
      firstRender: this.firstRender,
      clientOnly: this.clientOnly,
    }
  }
}
