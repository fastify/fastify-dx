#!/usr/bin/env node

const commands = {
  dev: process.argv[2] === 'dev',
  setup: process.argv[2] === 'setup',
  build: process.argv[2] === 'build',
}

if (Object.keys(commands).length) {
  for (const cmd of Object.keys(commands)) {
    if (commands[cmd]) {
      const command = await import(`./cmd/${cmd}.mjs`)
      await command.default()
    }
  }
} else {
  await import('./listen.mjs')
}
