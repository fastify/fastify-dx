export const hooks = [
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

export const methods = [
  'addHook',
  'decorate',
  'decorateRequest',
  'decorateReply',
]

export default { hooks, methods }