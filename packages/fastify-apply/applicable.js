const hooks = [
  'onRequest',
  'preParsing',
  'preValidation',
  'preHandler',
  'preSerialization',
  'onError',
  'onSend',
  'onResponse',
  'onTimeout',
  'onReady',
  'onClose',
  'onRoute',
  'onRegister',
]

const methods = [
  'addHook',
  'decorate',
  'decorateRequest',
  'decorateReply',
]

module.exports.hooks = hooks
module.exports.methods = methods
module.exports.default = {
  hooks,
  methods,
}
