import { createServer } from 'vite'
import pluginIndexHtml from './plugin-island/indexHtml'
import pluginReact from '@vitejs/plugin-react'

export default function createDevServer(root = process.cwd()) {
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  })
}
