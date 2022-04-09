import { getConfig } from './config.mjs'
import { configure, listen } from './core.mjs'

const config = await getConfig()

if (!config.init) {
  console.error(`No init file found at \`${config.initPath}\`.`)
  process.exit(1)
}

const app = await configure(config)

await listen(app, config)
