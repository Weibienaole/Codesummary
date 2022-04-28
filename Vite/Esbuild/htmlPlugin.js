const fs = require('fs/promises')
const path = require('path')
const { createLink, createScript, generateHTML } = require('./utils/index')

module.exports = () => ({
  name: 'esbuild:html',
  setup(build) {
    build.onEnd(async buildResult => {
      // 有错误信息即弹出
      if (buildResult.errors.length) {
        return
      }
      const { metafile } = buildResult
      const scripts = []
      const links = []
      if (metafile) {
        const { outputs } = metafile
        // 获取所有keys
        const assets = Object.keys(outputs)
        for (let item of assets) {
          // 查询尾缀，根据不同情况进行push
          if (item.endsWith('.js')) {
            scripts.push(createScript(item))
          } else if (item.endsWith('.css')) {
            links.push(createLink(item))
          }
        }
      }
      const htmlStr = generateHTML(scripts, links)
      const htmlPath = path.join(process.cwd(), 'index.html')
      // 同步写入文件 也可以将 async/await 换成 writeFileSync
      await fs.writeFile(htmlPath, htmlStr)
    })
  }
})
