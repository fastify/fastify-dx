import { getConfig } from './config.mjs'
import { configure, listen } from './core.mjs'

const config = await getConfig()
const app = await configure(config)

// Unless we're running a CLI command, start the server
if (config.command) {
  await listen(app, config)
}
