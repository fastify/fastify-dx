import { on } from 'node:events'
import readline from 'node:readline'
import { levels } from 'pino'
import colorize from 'colorize'

// This serves as a minimally user-friendly log redactor
// for Fastify's pino-backed JSON output.

// Since there's no need to take special precautions
// in development mode, this just uses a readline reader
// to parse and pretty print the output from the Fastify process
export async function startDevLogger (input, defaultLevel) {
  const rl = readline.createInterface({ input })

  for await (const [line] of on(rl, 'line')) {
    log(line, defaultLevel)
  }
}

export const trace = (msg) => log(msg, 'trace')
export const debug = (msg) => log(msg, 'debug')
export const info = (msg) => log(msg, 'info')
export const warn = (msg) => log(msg, 'warn')
export const error = (msg) => log(msg, 'error')
export const fatal = (msg) => log(msg, 'fatal')

export function log (line, defaultLevel) {
  let json
  if (line[0] === '{') {
    json = JSON.parse(line)
  }
  if (!json?.level) {
    json = { msg: line, level: levels.values[defaultLevel] }
  }
  console.log(methods[levels.labels[json.level]](json))
}

// Matches pino.levels
const methods = {
  trace: (log) => colorize.ansify(`#magenta[ℹ ${log.msg}]`),
  debug: (log) => colorize.ansify(`#magenta[ℹ ${log.msg}]`),
  info: (log) => colorize.ansify(`#cyan[ℹ ${log.msg}]`),
  warn: (log) => colorize.ansify(`#yellow[ℹ ${log.msg}]`),
  error: (log) => colorize.ansify(`#red[ℹ ${log.msg}]`),
  fatal: (log) => colorize.ansify(`#red[ℹ ${log.msg}]`),
}
