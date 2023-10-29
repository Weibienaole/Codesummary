import { init, parse } from 'es-module-lexer'
import MagicString from 'magic-string'
import path from 'path'

import {
  BARE_IMPORT_RE,
  CLIENT_PUBLIC_PATH,
  PRE_BUNDLE_DIR,
  isInternalRequest
} from '../../constant'
import { Plugin } from '../plugin'
import { ServerContext } from '../server'
import { cleanUrl, getShortName, isRequestJs, normalizePath } from '../utils'

// import分析，bare import重写产出路径，相对路径解析
export function importAnalysis(): Plugin {
  let serverContext: ServerContext
  return {
    name: 'm-vite:import-analysis',
    configureServer(s) {
      serverContext = s
    },
    async transform(code: string, id: string) {
      if (!isRequestJs(id) || isInternalRequest(id)) {
        return null
      }
      await init
      const [imports] = await parse(code)
      const ms = new MagicString(code)

      const resolve = async (id: string, importer: string) => {
        const resolved = await this.resolve(id, normalizePath(importer))
        if (!resolved) {
          return
        }
        const cleanedId = cleanUrl(resolved.id)
        const mod = moduleGraph.getModuleById(cleanedId)
        let resolvedId = `/${getShortName(resolved.id, serverContext.root)}`
        if (mod && mod.lastHTMLTimestamp) {
          resolvedId += '?t=' + mod.lastHTMLTimestamp
        }
        return resolvedId
      }

      const { moduleGraph } = serverContext
      const curMod = moduleGraph.getModuleById(id)!
      const importedModules = new Set<string>()

      for (const importInfo of imports) {
        const { s: modStart, e: modEnd, n: modSource } = importInfo
        if (!modSource) continue
        if (modSource.endsWith('.svg')) {
          // 添加 ?import 标识，重写路径
          const resolvedUrl = await resolve(modSource, id)
          ms.overwrite(modStart, modEnd, `${resolvedUrl}?import`)
          continue
        }
        if (BARE_IMPORT_RE.test(modSource)) {
          const bundlePath = normalizePath(
            path.join('/', PRE_BUNDLE_DIR, modSource + '.js')
          )
          importedModules.add(bundlePath)
          // 将内容重写 改写后的bare import包路径
          ms.overwrite(modStart, modEnd, bundlePath)
        } else if (id.startsWith('.') || id.startsWith('/')) {
          const resolveId = await resolve(modSource, id)
          if (resolveId) {
            importedModules.add(resolveId)
            ms.overwrite(modStart, modEnd, resolveId)
          }
        }
      }
      if (!id.includes('node_modules')) {
        // 业务代码注入热更新函数
        ms.prepend(
          `import { createHotContext as __vite__createHotContext } from "${CLIENT_PUBLIC_PATH}";\n` +
            `import.meta.hot = __vite__createHotContext(${JSON.stringify(
              cleanUrl(curMod.url)
            )});\n`
        )
      }
      // 将更改的模块，收集后更新
      moduleGraph.updateModuleInfo(curMod, importedModules)
      return {
        code: ms.toString(),
        map: ms.generateMap()
      }
    }
  }
}
