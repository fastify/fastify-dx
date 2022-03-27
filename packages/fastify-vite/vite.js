
const { join, resolve, existsSync, writeFile, readFile } = require('./utils')
const { js, ts, mjs, cjs } = require('./commands')

async function ensureViteConfig (options) {
  const { baseDir, renderer, vite } = options
  for (const ext of [js, ts, mjs, cjs]) {
    const configPath = join(renderer.path, 'vite', `vite.config.${ext}`)
    if (ext && existsSync(configPath)) {
      await writeFile(
        join(baseDir, `vite.config.${ext}`), 
        await readFile(configPath)
      )
    }
  }
}

module.exports = { ensureViteConfig }
