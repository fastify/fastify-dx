
import { join } from 'path'
import { readdir } from 'fs/promises'

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
  delete pkg.devInstall.external[oldAdapter]
  pkg.devInstall.external[newAdapter] '^0.1.0'
  pkg.devInstall.external.fastify = '^4.9.2'
  pkg.dependencies = []
  for (const [ext, version] of Object.entries(pkg.devInstall.external)) {
    pkg.dependencies[ext] = version
  }
  for (const [ext, version] of Object.entries(pkg.devInstall.local)) {
    pkg.dependencies[ext] = version
  }
  await writeFile(pkg, JSON.stringify(pkg, null, 2))
}