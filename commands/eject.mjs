const force = process.argv.includes('--force')
const { parse, resolve } = require('path')
const { existsSync } = require('fs')
const { ensureDir } = require('fs-extra')

function eject (app, options) {
  for (const blueprintFile of options.blueprint) {
    if (force || !existsSync(resolve(options.root, blueprintFile))) {
      const filePath = resolve(options.root, blueprintFile)
      const fileDir = parse(filePath).dir
      await ensureDir(fileDir)
      await writeFile(
        filePath,
        await readFile(resolve(renderer.path, 'base', blueprintFile)),
      )
      app.log.info(`ejected ${filePath}.`)
    }
  }
}

module.exports = eject
