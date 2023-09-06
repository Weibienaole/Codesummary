import path from 'path'
import fs from 'fs-extra'
import { build } from 'esbuild'
import resolve from 'resolve'
import { normalizePath } from 'vite'

const PRE_BUNDLE_DIR = 'vendors'

const preBundle = async (deps: string[]) => {
  const flattenDepMap = {} as Record<string, string>

  for (const dep of deps) {
    // / ---> _
    const flattenName = dep.replace(/\//g, '_')
    flattenDepMap[flattenName] = dep
  }
  const outputAbsolutePath = path.join(process.cwd(), PRE_BUNDLE_DIR)

  if (await fs.pathExists(outputAbsolutePath)) {
    await fs.remove(outputAbsolutePath)
  }

  await build({
    entryPoints: flattenDepMap,
    outdir: PRE_BUNDLE_DIR,
    bundle: true,
    minify: true,
    splitting: true,
    format: 'esm',
    platform: 'browser',
    plugins: [
      {
        name: 'pre-bundle',
        setup(build) {
          // bare import 裸导入 -> import react from 'react'
          build.onResolve({ filter: /^[\w@][^:]/ }, async (args) => {
            if (!deps.includes(args.path)) {
              return
            }
            const isEntry = !args.importer
            const resolved = resolve.sync(args.path, {
              basedir: args.importer || process.cwd()
            })
            // 将导入的入口文件设置tag
            return isEntry
              ? { path: resolved, namespace: 'dep' }
              : { path: resolved }
          })
          build.onLoad({ filter: /.*/, namespace: 'dep' }, async (args) => {
            // 拦截指定的tag，自定义内容，得以导出
            const entryPath = normalizePath(args.path)
            const res = require(entryPath)
            const depNames = Object.keys(res)

            return {
              contents: `
                export { ${depNames.join(', ')} } from '${entryPath}';
                export default require('${entryPath}')
              `,
              loader: 'js',
              resolveDir: process.cwd()
            }
          })
        }
      }
    ]
  })
}

preBundle(['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'])
