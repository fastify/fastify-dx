#!/usr/bin/env node

import { setup, listen } from './server.mjs'
import { getContext, getDispatcher } from './core.mjs'

const context = await getContext(process.argv[2])
const dispatcher = getDispatcher(context, {
  dev: () => {
    context.dev = true
  }
})

await dispatcher('dev')

const app = await setup(context, dispatcher)

if (!context.init?.generate?.server) {
  await listen(app, context)
}
