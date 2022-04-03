const { resolve } = require('path')
const { join, existsSync, writeFile, readFile } = require('./utils')
const { js, ts, mjs, cjs } = require('./argv')

const kinds = { js, ts, mjs, cjs }

async function ensureStarterView () {
  const indexViewPath = resolve(this.options.root, 'index.html')
  if (!existsSync(indexViewPath)) {
    const baseIndexViewPath = resolve(this.options.renderer.starter)
    await writeFile(indexViewPath, await readFile(baseIndexViewPath, 'utf8'))
  }
  return indexViewPath
}

async function ensureIndexHtml (options) {
  const indexHtmlPath = resolve(this.options.root, 'index.html')
  if (!existsSync(indexHtmlPath)) {
    const baseIndexHtmlPath = resolve(options.renderer.path, 'base', 'index.html')
    await writeFile(indexHtmlPath, await readFile(baseIndexHtmlPath, 'utf8'))
  }
  return indexHtmlPath
}

async function ensureConfigFile (config, kind = null) {
  const { configRoot, renderer } = config
  if (!kind) {
    for (const _ of Object.keys(kinds)) {
      if (kinds[_]) {
        kind = _
        break
      }
    }
    if (!kind) {
      kind = 'mjs'
    }
  }
  console.log('kind', kind)
  const sourcePath = join(renderer.path, 'vite', `vite.config.${kind}`)
  const targetPath = join(configRoot, `vite.config.${kind}`)
  if (existsSync(sourcePath) && !existsSync(targetPath)) {
    await writeFile(targetPath, await readFile(sourcePath))
  }
}

module.exports = {
  ensureIndexHtml,
  ensureStarterView,
  ensureConfigFile,
}
