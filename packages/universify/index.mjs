#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { registerGlobals } from './runner.mjs'
import chokidar from 'chokidar'
import colorize from 'colorize'

if (isDev()) {
  let node

  registerGlobals()
  watch()

  await start()

  async function start () {
    node = getNode()
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
    return $`${
      process.argv[0]
    } ${
      listenPath
    } ${
      process.argv.slice(2).map(arg => $.originalQuote(arg)).join(' ')
    }`
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
} else {
  await import('./listen.mjs')
}

function isDev () {
  return process.argv.filter(cmd => !cmd.startsWith('-'))[2] === 'dev'
}
