import { Plugin } from 'vite'
import pluginReact from '@vitejs/plugin-react'

import pluginIndexHtml from './plugin-island/indexHtml'
import pluginConfig from './plugin-island/config'
import pluginRoutes from './plugin-routes'
import { SiteConfig } from 'shared/types'
import { pluginMdx } from './plugin-mdx'
import pluginUnocss from 'unocss/vite'
import unocssOptions from './unocssOptions'
import { join } from 'path'
import { PACKAGE_ROOT } from './constants'
import babelPluginZisland from './babel-plugin-zisland'

export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR: boolean = false
): Promise<Plugin[]> {
  return [
    pluginUnocss(unocssOptions),
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic',
      jsxImportSource: isSSR ? join(PACKAGE_ROOT, 'src', 'runtime') : 'react',
      babel: {
        plugins: [babelPluginZisland]
      }
    }),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root,
      isSSR
    }),
    await pluginMdx()
  ] as Plugin[]
}
