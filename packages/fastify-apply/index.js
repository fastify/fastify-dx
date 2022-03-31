'use strict'

const fp = require('fastify-plugin')
const { hooks, methods } = require('./applicable')

function fastifyApply (fastify, options, done) {
  function addHook (fastify, prop, value) {
    if (Array.isArray(value)) {
      for (const item of value) {
        addHook(fastify, prop, item)
      }
      return
    }
    fastify.addHook(prop, value)
  }

  function runMethod (fastify, method, value) {
    for (const [k, v] of Object.entries(value)) {
      fastify[method](k, v)
    }
  }

  const skip = ['before', 'after', 'encapsulate']

  async function apply (obj) {
    const wrapper = async function (fastify) {
      if (obj.before) {
        await obj.before(fastify)
      }
      for (const [k, v] of Object.entries(obj)) {
        if (skip.includes(k)) {
          continue
        }
        if (hooks.includes(k) && v) {
          addHook(fastify, k, v)
        }
        if (methods.includes(k) && v) {
          runMethod(fastify, k, v)
        }
      }
      if (obj.after) {
        await obj.after(fastify)
      }
    }
    if (obj.encapsulate) {
      await fastify.register(wrapper)
    } else {
      await fastify.register(fp(wrapper))
    }
  }

  fastify.decorate('apply', apply)
  done()
}

module.exports = fp(fastifyApply)
