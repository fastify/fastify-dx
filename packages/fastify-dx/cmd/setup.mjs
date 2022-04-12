
import { ensureConfigFile, ejectBlueprint } from 'fastify-vite'
import { getConfig } from '../config.mjs'
import { startDevLogger } from '../logger.mjs'

export default async ({ quiet, $, fs, path }) => {
  const { root, renderer } = await getConfig(null)

  const fastifyViteConfig = {
    root: path.join(root, 'client'),
    renderer,
  }

  await Promise.all([
    ensureConfigFile(root, fastifyViteConfig),
    ejectBlueprint(root, fastifyViteConfig),
    ensureServerFile(root),
  ])

  await ensurePackageJSON(root)
  let npmInstall
  try {
    npmInstall = quiet($`npm install`)
    startDevLogger(npmInstall.stdout, 'debug')
    startDevLogger(npmInstall.stderr, 'error')
    await npmInstall
  } catch {
    // Displayed by devLogger
  }

  async function ensureServerFile (base) {
    const serverPath = path.join(base, 'server.mjs')
    if (!await fs.exists(serverPath)) {
      await fs.writeFile(serverPath, 'export default ({ app }) => {}\n')
    }
  }

  async function ensurePackageJSON (root) {
    const packageJSON = {
      type: 'module',
      name: path.dirname(root),
      version: '0.0.1',
      description: 'A Fastify DX application.',
      dependencies: {
        'fastify-dx': '^0.0.2',
      },
    }
    const packageJSONPath = path.join(root, 'package.json')
    if (!await fs.exists(packageJSONPath)) {
      await fs.writeFile(packageJSONPath, JSON.stringify(packageJSON))
    } else {
      const original = JSON.parse(await fs.readFile(packageJSONPath, 'utf8'))
      if (!original.dependencies) {
        original.dependencies = {}
      }
      if (packageJSON.dependencies) {
        for (const [dep, version] of Object.entries(packageJSON.dependencies)) {
          original.dependencies[dep] = version
        }
      }
      await fs.writeFile(packageJSONPath, JSON.stringify(original, null, 2))
    }
  }
}
