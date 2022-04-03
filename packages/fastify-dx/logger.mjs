import { on } from 'node:events'
import readline from 'node:readline'
import { levels } from 'pino'
import colorize from 'colorize'

// This serves as a minimally user-friendly log redactor
// for Fastify's pino-backed JSON output.
// Since there's no need to take special precautions
// in development mode, this just uses a readline reader
// to parse and pretty print the output from the Fastify process
export async function startDevLogger (input) {
  const rl = readline.createInterface({ input })

  for await (const [line] of on(rl, 'line')) {
    log(line)
  }
}

export default {
  trace: (msg) => log('trace', msg),
  debug: (msg) => log('debug', msg),
  info: (msg) => log('info', msg),
  warn: (msg) => log('warn', msg),
  error: (msg) => log('error', msg),
  fatal: (msg) => log('fatal', msg),
}

export function log (line) {
  let json
  if (line[0] === '{') {
    json = JSON.parse(line)
  }
  if (!json) {
    json = { msg: line, level: 'info' }
  }
  console.log(methods[levels.labels[json.level]](json))
}

// Matches pino.levels
const methods = {
  trace: (log) => colorize.ansify(`ℹ #magenta[${log.msg}]`),
  debug: (log) => colorize.ansify(`ℹ #magenta[${log.msg}]`),
  info: (log) => colorize.ansify(`ℹ #cyan[${log.msg}]`),
  warn: (log) => colorize.ansify(`ℹ #yellow[${log.msg}]`),
  error: (log) => colorize.ansify(`ℹ #red[${log.msg}]`),
  fatal: (log) => colorize.ansify(`ℹ #red[${log.msg}]`),
}
