const { parse: parsePath } = require('path')
const { join, walk, ensure, exists, write, read } = require('./ioutils')
const { stringify } = require('json5')

async function ejectBlueprint (base, { root, renderer, blueprint = 'base' }) {
  await ensure(join(base, root))
  const blueprintPath = join(renderer.path, blueprint)
  if (!renderer.blueprints.includes(blueprint) || !exists(blueprintPath)) {
    throw new Error(`Blueprint ${blueprint} not registered for this renderer.`)
  }
  for await (const { stats, path } of walk(blueprintPath)) {
    const filePath = join(base, root, path)
    const { dir: fileDir } = parsePath(filePath)
    await ensure(fileDir)
    if (!stats.isDirectory() && !exists(filePath)) {
      const bfilePath = join(renderer.path, blueprint, path)
      await write(filePath, await read(bfilePath, 'utf8'))
    }
  }
}

async function ensureConfigFile (base, { root, renderer }) {
  const sourcePath = join(renderer.path, 'config', `vite.config.js`)
  const targetPath = join(base, `vite.config.js`)
  if (exists(sourcePath) && !exists(targetPath)) {
    const generatedConfig = await read(sourcePath, 'utf8')
    await write(targetPath, appendToConfig(generatedConfig, { root }))
  }
  return targetPath
}

function appendToConfig (source, config = {}) {
  config = stringify(config, null, 2)
  const replacer = (m) => {
    return `${m}\n${config.split(/\r?\n/).slice(1, -1).join('\n')}`
  }
  return source
    .replace(/export default defineConfig\(\{/, replacer)
    .replace(/export default \{/, replacer)
    .replace(/export default defineConfig\(\{/, replacer)
}

module.exports = {
  ensureConfigFile,
  ejectBlueprint,
}
module.exports.default = module.exports
