// This serves as a minimally user-friendly log redactor 
// for Fastify's pino-backed JSON output

// Since there's no need to take special precautions
// in development mode, this just uses a Writable stream
// to parse and pretty print the output from the Fastify process

import { Writable } from 'stream'
import colorize from 'colorize'

export const devLogger = () => {
  const writable = new Writable()

  writable._write = (chunk, encoding, next) => {
    console.log('!')
    let json
    const str = chunk.toString()
    try {
      json = JSON.parse(str)
    } catch {
      // No JSON
    }
    if (json && levels[json.level]) {
      console.log(levels[json.level](json))
    } else {
      console.log(str)
    }
    next()
  }

  return writable
}

// Matches pino.levels
const levels = {
  // trace
  10: (log) => colorize.ansify(`ℹ #magenta[${log.msg}]`),
  // debug
  20: (log) => colorize.ansify(`ℹ #magenta[${log.msg}]`),
  // info
  30: (log) => colorize.ansify(`ℹ #cyan[${log.msg}]`),
  // warn
  40: (log) => colorize.ansify(`ℹ #yellow[${log.msg}]`),
  // error
  50: (log) => colorize.ansify(`ℹ #red[${log.msg}]`),
  // fatal
  60: (log) => colorize.ansify(`ℹ #red[${log.msg}]`),
}
