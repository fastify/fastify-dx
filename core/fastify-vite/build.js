
// This file is meant to eliminate the need to
// have two calls to vite build in package.json:
//
// "build:client": "vite build --ssrManifest --outDir dist/client",
// "build:server": "vite build --ssr entry/server.js --outDir dist/server",

const { move } = require('fs-extra')
const { build: viteBuild, mergeConfig } = require('vite')
const { join } = require('path')

async function build (options) {
  const { vite } = options
  const outDir = vite.build.outDir || 'dist'
  const client = mergeConfig(vite, {
    build: {
      outDir: `${outDir}/client`,
      ssrManifest: true,
    },
  })
  const serverOutDir = `${outDir}/server`
  const server = mergeConfig(vite, {
    build: {
      ssr: true,
      outDir: serverOutDir,
      rollupOptions: {
        input: join(options.root, options.entry.server),
      },
    },
  })
  await Promise.all([viteBuild(client), viteBuild(server)])
  await move(join(serverOutDir, 'server.js'), join(serverOutDir, 'server.cjs'))
  console.log(`ℹ created builds at ${outDir}/client and ${outDir}/server.`)
}

module.exports = { build }
