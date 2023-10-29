import fs from 'fs-extra'
import esbuild from 'esbuild'
import path from 'path'

import { Plugin } from '../plugin'
import { isRequestJs } from '../utils'

// 特殊js脚本通过esbuild转换为js
export function esBuildTrasnform(): Plugin {
  return {
    name: 'm-vite:esbuild-trasnform',
    async load(id) {
      if (isRequestJs(id)) {
        try {
          const code = await fs.readFile(id, 'utf-8')
          return code
        } catch {
          return null
        }
      }
    },
    async transform(code, id) {
      if (isRequestJs(id)) {
        const exname = path.extname(id).slice(1)
        const { code: trasnfromCode, map } = await esbuild.transform(code, {
          target: 'esnext',
          format: 'esm',
          sourcemap: true,
          loader: exname as 'tsx' | 'jsx' | 'ts' | 'js'
        })
        return {
          code: trasnfromCode,
          map
        }
      }
      return null
    }
  }
}
