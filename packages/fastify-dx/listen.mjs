import { getConfig, suppressExperimentalWarnings } from './config.mjs'
import { configure, listen } from './core.mjs'

const config = await getConfig()

if (!config.init) {
  console.error('No server init file found.')
  process.exit(1)
}

if (config.suppressExperimentalWarnings) {
  suppressExperimentalWarnings()
}

const app = await configure(config)

await listen(app, config)
