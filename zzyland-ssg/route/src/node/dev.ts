import { createServer } from 'vite'
import pluginIndexHtml from './plugin-island/indexHtml'
import pluginReact from '@vitejs/plugin-react'
import { PACKAGE_ROOT } from './constants'
import { resolveConfig } from './config'
import pluginConfig from './plugin-island/config'

export async function createDevServer(
  root = process.cwd(),
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development')

  return createServer({
    root: PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      pluginReact({
        jsxRuntime: 'automatic'
      }),
      pluginConfig(config, restartServer)
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  })
}
