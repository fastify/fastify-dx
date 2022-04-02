#!/usr/bin/env node
/* global $,path */

const commands = {
  dev: process.argv[2] === 'dev',
  setup: process.argv[2] === 'setup',
}

if (Object.keys(commands).length) {
  for (const cmd of Object.keys(commands)) {
    if (commands[cmd]) {
      await import(`./cmd/${cmd}.mjs`)
    }
  }
} else {
  await import('./listen.mjs')
}
