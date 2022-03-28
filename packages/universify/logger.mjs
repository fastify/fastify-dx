// This serves as a minimally user-friendly log redactor 
// for Fastify's pino-backed JSON output

// Since there's no need to take special precautions
// in development mode, this just uses a Writable stream
// to parse and pretty print the output from the Fastify process

import readline from 'node:readline'
import fs from 'fs'

import { on } from 'events'
import colorize from 'colorize'

export const startDevLogger = async (input) => {
  const rl = readline.createInterface({ input })

  for await (const [line] of on(rl, 'line')) {
    let json
    try {
      json = JSON.parse(line)
    } catch {
      // No JSON
    }
    if (json && levels[json.level]) {
      console.log(levels[json.level](json))
    } else {
      console.log(line)
    }
  }
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
