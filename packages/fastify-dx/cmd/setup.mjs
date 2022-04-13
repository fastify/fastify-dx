
import { fileURLToPath } from 'url'
import { setTimeout } from 'timers/promises'
import { ensureConfigFile, ejectBlueprint } from 'fastify-vite'
import { getConfig } from '../config.mjs'
import { startDevLogger, info, warn } from '../logger.mjs'
import { startSpinner } from 'zx/experimental'
import kleur from 'kleur'

export default async ({ quiet, $, cd, fs, path }) => {
  const { root, renderer } = await getConfig(null)
  const localRoot = root.replace(process.cwd(), '.')

  info('')
  info(`Welcome to ${kleur.bold('Fastify DX')}!`)
  info('')

  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const packageInfo = JSON.parse(
    await fs.readFile(path.resolve(__dirname, '..', 'package.json'), 'utf8'),
  )

  const fastifyViteConfig = {
    root: path.join(root, 'client'),
    renderer,
  }

  const withInfo = (promise, msg) => {
    promise.then(() => warn(msg))
  }

  await Promise.all([
    withInfo(
      ensurePackageJSON(root),
      `Created ${kleur.bold(`${localRoot}/package.json`)} file ✓`,
    ),
    withInfo(
      ensureConfigFile(root, fastifyViteConfig),
      `Created ${kleur.bold(`${localRoot}/vite.config.js`)} file ✓`,
    ),
    withInfo(
      ejectBlueprint(root, fastifyViteConfig),
      `Created ${kleur.bold(`${localRoot}/client/`)} boilerplate ✓`,
    ),
    withInfo(
      ensureServerFile(root),
      `Created ${kleur.bold(`${localRoot}/server.js`)} init file ✓`,
    ),
  ])

  await setTimeout(100)

  let npmInstall
  try {
    cd(root, false)
    warn('')
    warn(`Running ${kleur.bold('npm install')}.`)
    const stop = startSpinner()
    npmInstall = quiet($`npm install`)
    // startDevLogger(npmInstall.stdout, 'warn')
    startDevLogger(npmInstall.stderr, 'error')
    await npmInstall
    warn('Installed npm dependencies.')
    stop()
    info('')
    let rootDisplay = localRoot.replace('./', '')
    if (rootDisplay.length) {
      rootDisplay = ` ${rootDisplay}`
    }
    info(`All set, run ${kleur.bold(`dx dev${rootDisplay}`)} to get started.`)
  } catch (e) {
    console.log(e)
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
      name: path.parse(root).base,
      version: '0.0.1',
      description: 'A Fastify DX application.',
      dependencies: {
        'fastify-dx': `^${packageInfo.version}`,
      },
    }
    const packageJSONPath = path.join(root, 'package.json')
    if (!await fs.exists(packageJSONPath)) {
      await fs.writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2))
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
