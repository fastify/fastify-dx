
const arg = require('arg')

const argv = arg({
  '--url': String,
  '--server': Boolean,
})

// Causes the Fastify server boot to halt after onReady
const build = argv._.includes('build') && argv

// Extracts the base blueprint files from the renderer adapter and exits
const eject = argv._.includes('eject') && argv

// Builds production bundle and prerenders specified URLs
const generate = argv._.includes('generate') && argv

// Builds production bundle, prerenders specified URLs and
// opens HTTP with API to trigger re-rendering URLs on-demand
const generateServer = generate && argv['--server']

// Builds production bundle, prerenders specified URLs and
// opens HTTP with API to trigger re-rendering URLs on-demand
const generateURL = generate && argv['--url']

// Set preferred extension when generating Vite config or ejecting files
const mjs = argv['--js']
const cjs = argv['--js']
const js = argv['--js']
const ts = argv['--js']

module.exports = {
  build,
  eject,
  generate,
  generateServer,
  generateURL,
  mjs,
  cjs,
  js,
  ts,
}
