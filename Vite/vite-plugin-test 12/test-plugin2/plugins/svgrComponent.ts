import { Plugin } from 'vite'
import * as fs from 'fs'
import * as resolve from 'resolve'

interface svgrPluginOptions {
  defaultExport: 'url' | 'component'
}

export default function svgrComponentPlugin(
  options: svgrPluginOptions
): Plugin {
  const { defaultExport = 'url' } = options
  return {
    name: 'vite-plugin-svgr',
    async transform(code, id) {
      if (!id.endsWith('.svg')) return code
      // svgr转换器
      const svgrTransform = require('@svgr/core').transform
      // esbuild 地址
      const esbuildPath = resolve.sync('esbuild', {
        basedir: require.resolve('vite')
      })
      const esbuild = require(esbuildPath)
      // 读取svg
      const svgCon = await fs.promises.readFile(id, 'utf-8')
      // 转换成react组件
      const reactSvg = await svgrTransform(
        svgCon,
        {},
        { componentName: 'ReactComponent' }
      )

      let componentCode = reactSvg

      // 如果为url，则替换
      if (defaultExport === 'url') {
        componentCode += code
        componentCode = componentCode.replace(
          'export default ReactComponent',
          'export { ReactComponent }'
        )
      }

      // 将react代码转译为浏览器可识别的代码
      const result = await esbuild.transform(componentCode, {
        loader: 'jsx'
      })

      return {
        code: result.code,
        map: null
      }
    }
  }
}
