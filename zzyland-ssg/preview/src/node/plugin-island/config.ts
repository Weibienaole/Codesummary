import type { Plugin } from 'vite'
import { join } from 'path'
import sirv from 'sirv'
import fs from 'fs-extra'

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
      // 拦截到引入名称  import siteData from 'zisland:site-data',拦截到之后添加 \0 前缀，标明为虚拟模块（\0为vite指定标识）
      if (id === PRESET_SITE_DATA_ID) {
        return '\0' + PRESET_SITE_DATA_ID
      }
    },
    load(id) {
      if (id === '\0' + PRESET_SITE_DATA_ID) {
        // 拦截到标识后的名称，进行自定义导出内容
        return `export default ${JSON.stringify(config.siteData)}`
      }
    },
    // 配置config文件更新之后热更新，重启服务
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
      if (fs.existsSync(publicDir)) {
        server.middlewares.use(sirv(publicDir))
      }
    }
  }
}
