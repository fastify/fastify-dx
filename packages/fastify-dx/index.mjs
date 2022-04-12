#!/usr/bin/env node

let command

for (const cmd of ['dev', 'setup', 'build']) {
  if (process.argv[2] === cmd) {
    command = await import(`./cmd/${cmd}.mjs`)
  }
}

if (command) {
  await command.default(await import('./zx.mjs'))
} else {
  await import('./listen.mjs')
}
