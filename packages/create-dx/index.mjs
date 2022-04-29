#!/usr/bin/env node

import { execSync } from 'child_process'

const [, , ...argv] = process.argv

execSync('npx fastify-dx setup ' + argv.join(' '), { stdio: 'inherit' })
