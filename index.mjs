#!/usr/bin/env node

import { setup, listen } from './server.mjs'
import { getContext, getCommand } from './core.mjs'

const context = await getContext(process.argv[2])
const command = getCommand()

command('dev', () => {
  context.dev = true
})

const app = await setup(context, dispatcher)

if (!context.init?.generate?.server) {
  await listen(app, context)
}
