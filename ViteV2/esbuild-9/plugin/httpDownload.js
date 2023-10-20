module.exports = () => ({
  name: 'esbuild:http',
  setup(build) {
    const http = require('http')
    const https = require('https')
    build.onResolve({ filter: /^https?:\/\// }, (args) => ({
      path: args.path,
      namespace: 'http-url'
    }))
    // 内部的cdn链接重写，下载
    build.onResolve({ filter: /.*/, namespace: 'http-url' }, (args) => ({
      path: new URL(args.path, args.importer).toString(),
      namespace: 'http-url'
    }))
    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
      const contents = await new Promise((resolve, reject) => {
        function fetch(url) {
          console.log(`Downloading ${url}...`)
          const lib = url.startsWith('https') ? https : http
          const req = lib
            .get(url, (res) => {
              if ([301, 302, 307].includes(res.statusCode)) {
                // 重定向
                fetch(new URL(res.headers.location, url).toString())
                // 中断当前请求
                req.abort()
              } else if (res.statusCode === 200) {
                const chunks = []
                res.on('data', (data) => chunks.push(data))
                res.on('end', () => resolve(Buffer.concat(chunks)))
              } else {
                reject(new Error(`GET ${url} failed: status ${res.statusCode}`))
              }
            })
            .on('error', reject)
        }
        fetch(args.path)
      })
      return { contents }
    })
  }
})
