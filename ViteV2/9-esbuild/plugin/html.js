const { createSript, createLink, generateHTML } = require('../utils')

const fs = require('fs')
const path = require('path')

module.exports = () => {
  return {
    name: 'esbuild:html',
    setup(build) {
      build.onEnd(async (buildResult) => {
        if (buildResult.errors.lenght > 0) return
        const { metafile } = buildResult
        const scripts = [],
          links = []
        if (metafile) {
          const { outputs } = metafile
          const assets = Object.keys(outputs)
          assets.forEach((filePath) => {
            if (filePath.endsWith('.js')) {
              scripts.push(createSript(filePath))
            } else if (filePath.endsWith('.css')) {
              links.push(createLink(filePath))
            }
          })
        }
        const content = generateHTML(scripts, links)
        const filePath = path.join(process.cwd(), 'index.html')
        fs.writeFileSync(filePath, content)
      })
    }
  }
}
