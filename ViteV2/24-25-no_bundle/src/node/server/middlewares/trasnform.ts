import { NextHandleFunction } from 'connect'
import { ServerContext } from '../index'
import {
  cleanUrl,
  isImportRequest,
  isRequestCss,
  isRequestJs
} from '../../utils'

export async function transformRequest(
  url: string,
  serverContext: ServerContext
) {
  const { pluginContainer, moduleGraph } = serverContext
  url = cleanUrl(url)
  let mod = await moduleGraph.getModuleByUrl(url)
  // 返回缓存内容
  if (mod && mod.transformResult) {
    return mod.transformResult
  }
  const resolveResult = await pluginContainer.resolveId(url)
  let transformCode
  if (resolveResult?.id) {
    let loadResult = await pluginContainer.load(resolveResult.id)
    if (typeof loadResult === 'object' && loadResult !== null) {
      loadResult = loadResult.code
    }
    mod = await moduleGraph.ensureEntryFormUrl(url)
    if (loadResult) {
      transformCode = await pluginContainer.transform(
        loadResult as string,
        resolveResult?.id
      )
    }
    // 添加缓存
    if (mod) {
      mod.transformResult = transformCode
    }
    return transformCode
  }
}

export function transformMiddleware(
  serverContext: ServerContext
): NextHandleFunction {
  return async (req, res, next) => {
    if (req.method !== 'GET' || !req.url) {
      return next()
    }
    const url = req.url
    if (isRequestJs(url) || isRequestCss(url) || isImportRequest(url)) {
      // 核心转换函数，依次调用resolve，load，trasnform
      let result = await transformRequest(url, serverContext)
      if (!result) {
        return next()
      }
      if (result && result.code) {
        result = result.code
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/javascript')
      return res.end(result)
    }
    next()
  }
}
