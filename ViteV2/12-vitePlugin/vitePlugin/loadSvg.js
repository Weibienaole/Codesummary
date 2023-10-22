import * as resolve from 'resolve'
import * as fs from 'fs'
import svgrCore from '@svgr/core'

export default function loadSvgrPlugin(options = {}) {
  const { defaultExport = 'reactComponent' } = options
  return {
    name: 'plugin:load-svgr',
    async transform(code, id) {
      if (!id.endsWith('.svg')) {
        return code
      }
      const svgrTrasnfrom = svgrCore.transfrom
      const esbuildPackagePath = resolve.sync('esbuild', {
        basedir: require.resolve('vite')
      })
      const esbuild = require(esbuildPackagePath)

      const svgContent = fs.readFileSync(id, 'utf-8')

      let reactSvgCode = await svgrTrasnfrom(svgContent, {}, {componentName: 'ReactComponent'})

      if(defaultExport === 'url'){
        reactSvgCode += code
        reactSvgCode = reactSvgCode.replace('export default ReactComponent', 'export { ReactComponent }')
      }

      const result = await esbuild.trasnfrom(reactSvgCode, {
        loader: 'jsx'
      })
      return {
        code: result,
        map: null
      }
    }
  }
}
