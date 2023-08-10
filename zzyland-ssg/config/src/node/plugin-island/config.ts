import { SiteConfig } from 'shared/types'
import type { Plugin } from 'vite'

const PRESET_SITE_DATA_ID = 'zisland:site-data'

export default function pluginConfig(
  config: SiteConfig,
  restartServer: () => Promise<void>
): Plugin {
  return {
    name: 'pluginConfig',
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
      const include = (id: string) => {
        return targetWatchFilePaths.some((p) => id.includes(p))
      }
      if (include(ctx.file)) {
        console.log('find', config.root, ctx.file)
        await restartServer()
      }
    }
  }
}
