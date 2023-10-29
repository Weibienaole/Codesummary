import fs from 'fs-extra'
import path from 'path'

import { Plugin } from '../plugin'
import { ServerContext } from '../server'
import { normalizePath } from '../utils'
import resolve from 'resolve'
import { DEFAULT_EXTERSIONS } from '../../constant'

// 引入文件路径转换为真实地址
export function resolvePlugin(): Plugin {
  let serverContext: ServerContext
  return {
    name: 'm-vite:resolve',
    configureServer(s) {
      serverContext = s
    },
    async resolveId(id, importer) {
      if (path.isAbsolute(id)) {
        if (fs.pathExistsSync(id)) {
          return {
            id
          }
        }
        id = path.join(serverContext.root, id)
        if (fs.pathExistsSync(id)) {
          return { id }
        }
      } else if (id.startsWith('.')) {
        if (!importer) {
          throw new Error("'importer' is undefined")
        }
        const hasExtersions = path.extname(id).length > 1
        let resolveId: string
        // 有后缀
        if (hasExtersions) {
          resolveId = normalizePath(
            resolve.sync(id, { basedir: path.dirname(importer) })
          )
          if (fs.pathExistsSync(resolveId)) {
            return {
              id: resolveId
            }
          }
        } else {
          for (const extname of DEFAULT_EXTERSIONS) {
            try {
              const newId = id + extname
              const resolveId = normalizePath(
                resolve.sync(newId, { basedir: path.dirname(importer) })
              )
              if (fs.pathExistsSync(resolveId)) {
                return {
                  id: resolveId
                }
              } else continue
            } catch (e) {
              continue
            }
          }
        }
      }
      return null
    }
  }
}
