import { resolveBuildCommands } from 'fastify-vite'
import { getConfig } from '../config.mjs'
import { startDevLogger } from '../logger.mjs'

export default async ({ $, cd, quiet }) => {
  const { root, renderer } = await getConfig()
  cd(root, false)
  for (const cmd of await resolveBuildCommands(root, renderer)) {
    const viteProcess = quiet($`npx vite ${cmd}`)
    startDevLogger(viteProcess.stdout, 'info')
    startDevLogger(viteProcess.stderr, 'error')
    await viteProcess
  }
}
