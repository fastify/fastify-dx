
const arg = require('arg')

const argv = arg({
  '--url': String,
  '--server': Boolean,
})

// Causes the Fastify server boot to halt after onReady
export const build = argv._.includes('build') && argv

// Extracts the base blueprint files from the renderer adapter and exits
export const eject = argv._.includes('eject') && argv

// Builds production bundle and prerenders specified URLs
export const generate = argv._.includes('generate') && argv

// Builds production bundle, prerenders specified URLs and 
// opens HTTP with API to trigger re-rendering URLs on-demand
export const generateServer = generate && argv['--server']

// Builds production bundle, prerenders specified URLs and 
// opens HTTP with API to trigger re-rendering URLs on-demand
export const generateURL = generate && argv['--url']

// Set preferred extension when generating Vite config or ejecting files
export const mjs = argv['--js']
export const cjs = argv['--js']
export const js = argv['--js']
export const ts = argv['--js']
