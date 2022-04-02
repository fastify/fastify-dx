import { ensureConfigFile, ensureIndexHtml, ensureIndexView } from 'fastify-vite'
import { registerGlobals } from './runner.mjs'

registerGlobals()

export default async function (root, renderer) {
  const clientRoot = path.join(root, 'client')
  await Promise.all([
    ensureConfigFile(clientRoot, renderer),
    ensureIndexHtml(clientRoot),
    ensureIndexView(clientRoot, 'index'),
    ensureServerMJS(),
    ensureIndexVue(clientRoot),
  ])
  await ensurePackageJSON(root)
}

async function ensureServerMJS (root) {
  const appMJSPath = path.join(root, 'server.mjs')
  if (!await fs.exists(appMJSPath)) {
    await fs.writeFile(appMJSPath, `export default ({ app }) => {}`)
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
    await fs.writeFile(, packageJSON)
  }
}
