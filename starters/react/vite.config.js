import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import viteReact from '@vitejs/plugin-react'
import viteReactFastifyDX from 'fastify-dx-react/plugin'

const path = fileURLToPath(import.meta.url)

const root = join(dirname(path), 'client')
const plugins = [viteReact(), viteReactFastifyDX()]

export default { root, plugins }
