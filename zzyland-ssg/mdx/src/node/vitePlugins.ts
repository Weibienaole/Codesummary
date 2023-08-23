import { Plugin } from 'vite'
import pluginReact from '@vitejs/plugin-react'

import pluginIndexHtml from './plugin-island/indexHtml'
import pluginConfig from './plugin-island/config'
import pluginRoutes from './plugin-routes'
import { SiteConfig } from 'shared/types'
import { pluginMdx } from './plugin-mdx'

export function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>
): Plugin[] {
  return [
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic'
    }),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root
    }),
    pluginMdx()
  ] as Plugin[]
}
