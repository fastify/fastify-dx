/* global $,fs,path */

import { ensureConfigFile, ejectBlueprint } from 'fastify-vite'
import { registerGlobals } from '../zx.mjs'
import { getConfig } from '../config.mjs'
import logger from '../logger.mjs'

registerGlobals()

const cwd = process.cwd()
const { root, renderer } = await getConfig()

const fastifyViteConfig = {
  root: `.${path.sep}client`,
  renderer,
}

export default async () => {
  await Promise.all([
    ensureConfigFile(root, fastifyViteConfig),
    ejectBlueprint(root, fastifyViteConfig),
    ensureServerFile(root),
  ])

  // await ensurePackageJSON(root)
  // await $`npm install`
}

async function ensureServerFile (base) {
  const serverPath = path.join(base, 'server.mjs')
  if (!await fs.exists(serverPath)) {
    await fs.writeFile(serverPath, 'export default ({ app }) => {}\n')
  }
}

async function ensurePackageJSON (root) {
  const packageJSON = JSON.stringify({
    type: 'module',
    name: path.dirname(root),
    version: '0.0.1',
    description: 'A Fastify DX application.',
    dependencies: {
      'fastify-dx': '^0.0.5',
    },
  })
  const packageJSONPath = path.join(root, 'package.json')
  if (!await fs.exists(packageJSONPath)) {
    await fs.writeFile(packageJSONPath, packageJSON)
  }
}
