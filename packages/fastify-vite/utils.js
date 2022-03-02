const { writeFile, readFile } = require('fs/promises')
const { existsSync } = require('fs')

function suppressExperimentalWarnings () {
  // See https://github.com/nodejs/node/issues/30810
  const { emitWarning } = process

  process.emitWarning = (warning, ...args) => {
    if (args[0] === 'ExperimentalWarning') {
      return
    }
    if (args[0] && typeof args[0] === 'object' && args[0].type === 'ExperimentalWarning') {
      return
    }
    return emitWarning(warning, ...args)
  }
}

module.exports = {
  writeFile,
  readFile,
  existsSync,
  suppressExperimentalWarnings,
}
