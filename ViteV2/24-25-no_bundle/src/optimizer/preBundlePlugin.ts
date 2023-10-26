import { Loader, Plugin } from 'esbuild'
import path from 'path'
import resolve from 'resolve'
import { init, parse } from 'es-module-lexer'
import fs from 'fs-extra'

import { BARE_IMPORT_RE } from '../constant'
import { normalizePath } from '../utils'
// import createDebug from 'debug'

// const debug = createDebug('dev')

export async function preBundlePlugin(deps: Set<string>): Promise<Plugin> {
  return Promise.resolve({
    name: 'plugin:pre-bundle',
    setup(build) {
      build.onResolve({ filter: BARE_IMPORT_RE }, (resolveInfo) => {
        const { path: id, importer } = resolveInfo
        const isEntry = !importer
        if (deps.has(id)) {
          return isEntry
            ? {
                path: id,
                namespace: 'dep'
              }
            : {
                path: resolve.sync(id, { basedir: process.cwd() })
              }
        }
      })

      build.onLoad({ filter: /.*/, namespace: 'dep' }, async (loadInfo) => {
        await init
        const root = process.cwd()
        const id = loadInfo.path
        const entryPath = normalizePath(resolve.sync(id, { basedir: root }))
        const entryFile = await fs.readFile(entryPath, 'utf-8')
        const [imports, exports] = await parse(entryPath)
        const proxyModules: string[] = []
        if (!imports.length && !exports.length) {
          // cjs
          const cjsFile = require(entryPath)
          const cjsFileImports = Object.keys(cjsFile)
          proxyModules.push(
            `export { ${cjsFileImports.join(',')} } from '${entryPath}'`,
            `export default require('${entryPath}')`
          )
        } else {
          // esm
          if (exports.includes('default')) {
            proxyModules.push(`import d from '${entryPath}';export default d`)
          }
          proxyModules.push(`export * from '${entryPath}'`)
        }
        // debug('代理模块内容: %o:\n ' + proxyModules.join('\n'))
        const loader = path.extname(entryPath).slice(1) as Loader
        return {
          loader,
          contents: proxyModules.join('\n'),
          resolveDir: root
        }
      })
    }
  })
}
