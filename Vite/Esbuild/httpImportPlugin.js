module.exports = () => ({
  name: 'esbuild:http',
  setup(build) {
    const http = require('http')
    const https = require('https')
    // 筛选出具有https? 的路径
    build.onResolve({ filter: /^https?:\/\// }, (args) => ({
      path: args.path,
      namespace: 'http-url'
    }))
    // 拦截间接依赖的路径，重写path
    build.onResolve({ filter: /.*/, namespace: 'http-url' }, (args) => ({
      // 合并重写
      path: new URL(args.path, args.importer).toString(),
      namespace: 'http-url'
    }))
    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
      const contents = await new Promise((resolve, reject) => {
        function fetch(url) {
          console.log(`Downloading ${url}...`)
          // 根据开头判断类型
          const lib = url.startsWith('https') ? https : http;
          const req = lib.get(url, res => {
            if ([301, 302, 307].includes(res.statusCode)) {
              // 重定向
              fetch(new URL(res.headers.location, url)).toString()
              // 中止当前请求
              req.abort()
            } else if (res.statusCode === 200) {
              // 成功
              let chunks = []
              // 数据累加
              res.on('data', chunk => chunks.push(chunk))
              // 最后进行合并，并返回  buffer属于数据缓存 
              res.on('end', () => resolve(Buffer.concat(chunks)))
            } else {
              reject(
                new Error(`GET ${url} failed: status ${res.statusCode}`)
              )
            }
          }).on('error', reject)
        }
        fetch(args.path)
      })
      return { contents }
    })
  }
})
