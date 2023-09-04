import type { Plugin } from 'vite'
import { join } from 'path'
import sirv from 'sirv'

import { SiteConfig } from 'shared/types'
import { PACKAGE_ROOT } from 'node/constants'

const PRESET_SITE_DATA_ID = 'zisland:site-data'

export default function pluginConfig(
  config: SiteConfig,
  restartServer?: () => Promise<void>
): Plugin {
  return {
    name: 'zisland:config',
    resolveId(id) {
      if (id === PRESET_SITE_DATA_ID) {
        return '\0' + PRESET_SITE_DATA_ID
      }
    },
    load(id) {
      if (id === '\0' + PRESET_SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`
      }
    },
    async handleHotUpdate(ctx) {
      const targetWatchFilePaths = [config.configPath]
      const include = (id: string) =>
        targetWatchFilePaths.some((file) => id.includes(file))
      if (include(ctx.file)) {
        await restartServer()
      }
    },
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            '@runtime': join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts')
          }
        },
        css: {
          modules: {
            // style变量配置名称转换为驼峰
            localsConvention: 'camelCaseOnly'
          }
        }
      }
    },
    configureServer(server) {
      const publicDir = join(config.root, 'public')
      server.middlewares.use(sirv(publicDir))
    }
  }
}
