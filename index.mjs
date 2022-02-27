#!/usr/bin/env node

import Fastify from 'fastify'
import { setup, listen } from './server.mjs'
import { resolveInit, getContext, getDispatcher } from './utils.mjs'
import dev from './commands/dev.mjs'

const [init, root] = await resolveInit(process.argv[2])
const context = getContext({ init, root })
const dispatcher = getDispatcher(context, { dev })

await dispatcher(context)

const app = await setup(context, dispatcher)

await listen(app, context)
