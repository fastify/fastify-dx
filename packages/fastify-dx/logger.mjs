
import { on } from 'node:events'
import readline from 'node:readline'
import { levels } from 'pino'
import kleur from 'kleur'

// This serves as a minimally user-friendly log redactor
// for Fastify's pino-backed JSON output.

// Since there's no need to take special precautions
// in development mode, this just uses a readline reader
// to parse and pretty print the output from the Fastify process

export const trace = (msg) => log(msg, 'trace')
export const debug = (msg) => log(msg, 'debug')
export const info = (msg) => log(msg, 'info')
export const warn = (msg) => log(msg, 'warn')
export const error = (msg) => log(msg, 'error')
export const fatal = (msg) => log(msg, 'fatal')

const urlIgnorePatterns = [
  /^\/__vite_ping/,
  /^\/@((id)|(vite)|(fs))/,
  /\.(?:((m|c)?js|ts|vue|jsx|css))$/,
]

// Matches pino.levels
const methods = {
  // We just use colorize but it's already imported by other dependencies
  trace: (log) => kleur.magenta(`ℹ ${log.msg}`),
  debug: (log) => kleur.magenta(`ℹ ${log.msg}`),
  info: (log) => {
    if (log.res) {
      return
    }
    if (log.req) {
      if (urlIgnorePatterns.some(p => p.test(log.req.url))) {
        return
      }
      return kleur.cyan(`ℹ ${log.req.method} ${log.req.url}`)
    } else {
      return kleur.cyan(`ℹ ${log.msg}`)
    }
  },
  warn: (log) => kleur.yellow(`ℹ ${log.msg}`),
  error: (log) => {
    if (log.stack) {
      return log.stack.split('\n').map(l => kleur.red(`ℹ ${l}`))
    } else {
      return kleur.red(`ℹ ${log.msg}`)
    }
  },
  fatal: (log) => kleur.red(`ℹ ${log.msg}`),
}

export async function startDevLogger (input, defaultLevel) {
  const rl = readline.createInterface({ input })

  for await (const [line] of on(rl, 'line')) {
    log(line, defaultLevel)
  }
}

export function log (line, defaultLevel) {
  let json
  if (line[0] === '{') {
    json = JSON.parse(line)
  }
  if (!json?.level) {
    json = { msg: line, level: levels.values[defaultLevel] }
  }
  const result = methods[levels.labels[json.level]](json)
  if (!result) {
    return
  }
  if (Array.isArray(result)) {
    result.forEach(r => console.log(r))
  } else {
    console.log(result)
  }
}
