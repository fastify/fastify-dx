#!/usr/bin/env node

const commands = {
  dev: process.argv[2] === 'dev',
  setup: process.argv[2] === 'setup',
  build: process.argv[2] === 'build',
}

let command

for (const cmd of Object.keys(commands)) {
  if (commands[cmd]) {
    command = await import(`./cmd/${cmd}.mjs`)
  }
}

if (command) {
  await command.default()
} else {
  await import('./listen.mjs')
}
