
import { join } from 'path'
import { writeFile, readdir } from 'fs/promises'

const starters = await readdir(join(__dirname, 'starters'))

for (const starter of starters) {
  if (starter.startsWith('.')) {
    continue
  }
  const oldAdapter = `fastify-dx-${starter.split('-')[0]}`
  const newAdapter = `@fastify/${starter.split('-')[0]}`
  const pkgPath = join(__dirname, 'starters', starter, 'package.json')
  const pkg = require(pkgPath)
  pkg.devInstall.external.ky = '^0.31.4'
  delete pkg.devInstall.local[oldAdapter]
  delete pkg.devInstall.external['fastify-vite']
  pkg.devInstall.external['@fastify/vite'] = '^3.0.1'
  delete pkg.devInstall.local[newAdapter]
  delete pkg.devInstall.external[newAdapter]
  pkg.devInstall.local[newAdapter] = '^0.1.0'
  pkg.devInstall.external.fastify = '^4.9.2'
  pkg.dependencies = {}
  for (const [ext, version] of Object.entries(pkg.devInstall.external)) {
    pkg.dependencies[ext] = version
  }
  // for (const [local, version] of Object.entries(pkg.devInstall.local)) {
  //   pkg.dependencies[local] = version
  // }
  await writeFile(pkgPath, JSON.stringify(pkg, null, 2))
}