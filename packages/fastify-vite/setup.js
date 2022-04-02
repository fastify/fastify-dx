import { resolve } from 'path'

async function ensureStarterView () {
  const indexViewPath = resolve(this.options.root, 'index.html')
  if (!existsSync(indexViewPath)) {
    const baseIndexViewPath = resolve(this.options.renderer.starter)
    await writeFile(indexViewPath, await readFile(baseIndexViewPath, 'utf8'))
  }
  return indexViewPath
}

async function ensureIndexHtml () {
  const indexHtmlPath = resolve(this.options.root, 'index.html')
  if (!existsSync(indexHtmlPath)) {
    const baseIndexHtmlPath = resolve(this.options.renderer.path, 'base', 'index.html')
    await writeFile(indexHtmlPath, await readFile(baseIndexHtmlPath, 'utf8'))
  }
  return indexHtmlPath
}

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

module.exports = {
  ensureIndexHtml,
  ensureStarterView,
  ensureConfigFile,
}
