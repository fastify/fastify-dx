
const { join, existsSync, writeFile, readFile } = require('./utils')
const { js, ts, mjs, cjs } = require('./commands')

async function ensureConfigFile () {
  const { baseDir, renderer, viteConfig } = this.options
  if (viteConfig) {
    return
  }
  for (const ext of [js, ts, mjs, cjs]) {
    const configPath = join(renderer.path, 'vite', `vite.config.${ext}`)
    if (ext && existsSync(configPath)) {
      await writeFile(
        join(baseDir, `vite.config.${ext}`),
        await readFile(configPath),
      )
    }
  }
}

module.exports = { ensureConfigFile }