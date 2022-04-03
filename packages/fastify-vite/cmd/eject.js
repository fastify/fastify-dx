const { resolve, parse } = require('path')
const { ensureDir, existsSync, writeFile, readFile } = require('../utils')

async function eject () {
  const force = process.argv.includes('--force')
  for (const blueprintFile of this.options.renderer.blueprint) {
    if (force || !existsSync(resolve(this.options.root, blueprintFile))) {
      const filePath = resolve(this.options.root, blueprintFile)
      const fileDir = parse(filePath).dir
      await ensureDir(fileDir)
      await writeFile(
        filePath,
        await readFile(resolve(this.options.renderer.path, 'base', blueprintFile)),
      )
      console.log(`ℹ ejected ${filePath}.`)
    }
  }
  setImmediate(() => process.exit(0))
}

module.exports = eject
