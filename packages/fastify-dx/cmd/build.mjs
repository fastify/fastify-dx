/* global $ */

import { resolveBuildCommands } from 'fastify-vite'
import { quiet, registerGlobals } from '../zx.mjs'
import { getConfig } from '../config.mjs'
import { startDevLogger } from '../logger.mjs'

registerGlobals()

const { root, renderer } = await getConfig()

export default async () => {
  for (const cmd of await resolveBuildCommands(root, renderer)) {
    const viteProcess = quiet($`npx vite ${cmd}`)
    startDevLogger(viteProcess.stdout, 'info')
    startDevLogger(viteProcess.stderr, 'error')
    await viteProcess
  }

  // await ensurePackageJSON(root)
  // await $`npm install`
}
