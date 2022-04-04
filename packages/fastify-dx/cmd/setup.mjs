/* global $,fs,path */

import {
  ensureConfigFile,
  // ensureIndexHtml,
  // ensureIndexView,
} from 'fastify-vite'
import { registerGlobals } from '../zx.mjs'
import { getConfig } from '../config.mjs'

registerGlobals()

const cwd = process.cwd()
const { root, renderer } = await getConfig()

let clientRoot = path.join(root, 'client')

if (clientRoot.startsWith(cwd)) {
  clientRoot = clientRoot.replace(cwd, '')
}

export default async () => {
  await Promise.all([
    ensureConfigFile({
      configRoot: root,
      projectRoot: clientRoot,
      renderer,
    }),
    // ensureIndexHtml(clientRoot),
    // ensureIndexView(clientRoot, 'index'),
    // ensureServerFile(),
  ])

  await ensurePackageJSON(root)
  await $`npm install`
}

// async function ensureServerFile (root) {
//   const serverPath = path.join(root, 'server.mjs')
//   if (!await fs.exists(serverPath)) {
//     await fs.writeFile(serverPath, 'export default ({ app }) => {}\n')
//   }
// }

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
