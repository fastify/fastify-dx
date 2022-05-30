
export class RouteContext {
  constructor (server, req, reply, route, client) {
    this.server = server
    this.req = req
    this.reply = reply
    this.head = {}
    this.data = route.data
    this.streaming = route.streaming
    this.clientOnly = route.clientOnly
    this.serverOnly = route.serverOnly
  }

  toJSON () {
    return {
      data: this.data,
      static: this.static,
      clientOnly: this.clientOnly,
    }
  }
}
