import { createServer } from 'vite'
import { PACKAGE_ROOT } from './constants'
import { resolveConfig } from './config'
import { createVitePlugins } from './vitePlugins'

export async function createDevServer(
  root = process.cwd(),
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development')

  return createServer({
    root: PACKAGE_ROOT,
    plugins: await createVitePlugins(config, restartServer, false),
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  })
}
