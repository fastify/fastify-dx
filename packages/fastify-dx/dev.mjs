import readline from 'node:readline'
import { fileURLToPath } from 'node:url'
import { on } from 'node:events'

import chokidar from 'chokidar'
import colorize from 'colorize'

import { quiet, registerGlobals } from './zx.mjs'

let node

registerGlobals()
watch()

await start()

async function start () {
  node = getNode()

  startDevLogger(node.stdout)
  startDevLogger(node.stderr)

  try {
    await node
  } catch {
    // Printed to stderr automatically by zx
  }
}

function restart () {
  node.catch(() => start())
  node.kill()
}

function getNode () {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const listenPath = path.resolve(__dirname, 'listen.mjs')
  return quiet($`${
    process.argv[0]
  } ${
    listenPath
  } ${
    process.argv.slice(2).map(arg => $.originalQuote(arg)).join(' ')
  }`)
}

function watch () {
  const watcher = chokidar.watch(['*.mjs', '*.js', '**/.mjs', '**/.js'], {
    ignoreInitial: true,
    ignored: ['**/node_modules/**'],
  })
  const changed = reason => (path) => {
    console.log()
    console.log(`${reason} ${path.replace(process.cwd(), '')}`)
    console.log()
    restart()
  }
  watcher.on('add', changed(colorize.ansify('#green[A]')))
  watcher.on('unlink', changed(colorize.ansify('#red[D]')))
  watcher.on('change', changed(colorize.ansify('#yellow[M]')))
}

// This serves as a minimally user-friendly log redactor
// for Fastify's pino-backed JSON output.
// Since there's no need to take special precautions
// in development mode, this just uses a readline reader
// to parse and pretty print the output from the Fastify process
export async function startDevLogger (input) {
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
  /* trace */ 10: (log) => colorize.ansify(`ℹ #magenta[${log.msg}]`),
  /* debug */ 20: (log) => colorize.ansify(`ℹ #magenta[${log.msg}]`),
  /* info  */ 30: (log) => colorize.ansify(`ℹ #cyan[${log.msg}]`),
  /* warn  */ 40: (log) => colorize.ansify(`ℹ #yellow[${log.msg}]`),
  /* error */ 50: (log) => colorize.ansify(`ℹ #red[${log.msg}]`),
  /* fatal */ 60: (log) => colorize.ansify(`ℹ #red[${log.msg}]`),
}
