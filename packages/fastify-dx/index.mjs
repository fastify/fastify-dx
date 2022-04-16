#!/usr/bin/env node

let command

if (process.argv[2] === 'start') {
  await import('./listen.mjs')
} else {
  for (const cmd of ['dev', 'eject', 'setup', 'build']) {
    if (process.argv[2] === cmd) {
      command = await import(`./cmd/${cmd}.mjs`)
    }
  }
  if (command) {
    await command.default(await import('./zx.mjs'))
  }
  // TODO print usage
}
