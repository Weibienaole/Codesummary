import { build } from 'esbuild'
import path from 'path'
import { green } from 'picocolors'

import { scanPlugins } from './scanPlugin'
import { PRE_BUNDLE_DIR } from '../../constant'
import { preBundlePlugin } from './preBundlePlugin'

export const optimizer = async (root) => {
  // 1. 确定入口
  const entry = path.resolve(root, 'src/main.tsx')
  
  // 2. 从入口处扫描依赖
  const deps = new Set<string>()
  await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    plugins: [await scanPlugins(deps)]
  })
  console.log(
    `${green('需要预构建的依赖')}:\n${[...deps]
      .map(green)
      .map((item) => `  ${item}`)
      .join('\n')}`
  )
  // 3. 预构建依赖
  await build({
    entryPoints: [...deps],
    bundle: true,
    write: true,
    splitting: true,
    format: 'esm',
    outdir: path.resolve(root, PRE_BUNDLE_DIR),
    plugins: [await preBundlePlugin(deps)]
  })
  console.log('构建成功！');
  
}
