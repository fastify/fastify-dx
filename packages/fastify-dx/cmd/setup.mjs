
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

  const createIfNotExists = async (filePath, [create, created]) => {
    filePath = path.join(root, filePath)
    if (!fs.existsSync(filePath)) {
      await create(filePath)
      let fileName = path.parse(filePath).base
      if (fs.lstatSync(filePath).isDirectory()) {
        fileName = `${fileName}/`
      }
      created(kleur.bold(`${localRoot}/${fileName}`))
    }
  }

  await fs.ensureDir(root)

  await Promise.all([
    createIfNotExists('package.json', [
      path => ensurePackageJSON(path),
      file => warn(`Created ${file} file ✓`),
    ]),
    createIfNotExists('vite.config.js', [
      () => ensureConfigFile(root, fastifyViteConfig),
      file => warn(`Created ${file} file ✓`),
    ]),
    createIfNotExists('client', [
      () => ejectBlueprint(root, fastifyViteConfig),
      file => warn(`Created ${file} boilerplate ✓`),
    ]),
    createIfNotExists('server.js', [
      () => ensureServerFile(root),
      file => warn(`Created ${file} init file ✓`),
    ]),
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
    const serverPath = path.join(base, 'server.js')
    await fs.writeFile(serverPath, 'export default ({ app }) => {}\n')
  }

  async function ensurePackageJSON (packageJSONPath) {
    const packageJSON = {
      type: 'module',
      version: '0.0.1',
      description: 'A Fastify DX application.',
      dependencies: {
        'fastify-dx': `^${packageInfo.version}`,
      },
    }
    await fs.writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2))
  }
}
