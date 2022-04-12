import { resolveBuildCommands } from 'fastify-vite'
import { getConfig } from '../config.mjs'

export default async ({ $, quiet, startDevLogger }) => {
  const { root, renderer } = await getConfig()
  for (const cmd of await resolveBuildCommands(root, renderer)) {
    const viteProcess = quiet($`npx vite ${cmd}`)
    startDevLogger(viteProcess.stdout, 'info')
    startDevLogger(viteProcess.stderr, 'error')
    await viteProcess
  }
  // await ensurePackageJSON(root)
  // await $`npm install`
}
