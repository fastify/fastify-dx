#!/usr/bin/env node

import { setup, listen } from './server.mjs'
import { getCommand, getContext } from './core.mjs'

// A simple command runner, will instantly parse
// process.argv and allow running a function at any
// given point in time if one or more commands are matched
const command = getCommand()

// A simple object to hold application
// context variables, including the app instance itself
const context = await getContext(command)

command('dev', () => {
  // This setting is passed down to
  // fastify-vite to enable Vite's Dev Server
  context.dev = true
})

// Get the Fastify server instance from setup()
const app = await setup(context, command)

// Unless we're running a generate command, start the server
if (!context.init?.generate?.server) {
  await listen(app, context)
}
