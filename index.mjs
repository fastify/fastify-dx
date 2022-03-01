#!/usr/bin/env node

import { setup, listen } from './server.mjs'
import { getContext, getDispatcher } from './core.mjs'

import commands from './commands/index.mjs'

const context = await getContext(process.argv[2])
const dispatcher = getDispatcher(context, commands)

await dispatcher.immediate(context)

const app = await setup(context, dispatcher)

await listen(app, context)
