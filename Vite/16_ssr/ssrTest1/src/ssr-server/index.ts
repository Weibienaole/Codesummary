import express, { Express, RequestHandler } from 'express'
import { ViteDevServer } from 'vite'
import { renderToString } from 'react-dom/server'
import React from 'react'
import serve from 'serve-static'
const path = require('path')
const fs = require('fs')

const isProd = process.env.NODE_ENV === 'production'
const cwd = process.cwd()

// ssr中间件
async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
  let vite: ViteDevServer | null = null
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root: cwd,
      server: {
        middlewareMode: 'ssr'
      }
    })
    // 注册vite中间件，处理客户端资源
    app.use(vite.middlewares)
  }
  return async (req, res, next) => {
    const url = req.originalUrl
    try {
      if (!matchPageUrl(url)) {
        // 走静态资源的处理
        return await next()
      }
      /**
       * ssr逻辑
       * 1.加载服务端入口模块
       * 2.核心预取
       * 3.渲染组件-核心
       * 4.拼接HTML，返回相应
       *  */
      // 加载服务端入口模块
      const { ServerEntry, fetchData } = await loadSsrEntryModule(vite)
      // 预取数据
      const data = await fetchData()
      // 渲染组件
      // 调用 renderToStringAPI 将组件渲染为字符串
      const appHTML = renderToString(React.createElement(ServerEntry, { data }))
      // 拼接HTML 返回字符串
      const templatePath = resolveTemplatePath()
      let template = await fs.readFileSync(templatePath, 'utf-8')
      // 开发模式下需要注入 HMR、环境变量相关的代码，因此需要调用 vite.transformIndexHtml
      if (!isProd && vite) {
        template = await vite.transformIndexHtml(url, template)
      }
      // 将插槽替换成对应内容
      const html = template
        .replace('<!-- SSR_APP -->', appHTML)
        .replace(
          '<!-- SSR_DATA -->',
          `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`
        )
      // 最后结束返回内容
      res.status(200).setHeader('Content-type', 'text/html').end(html)
    } catch (e: any) {
      // vite 修复该堆栈
      vite?.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  }
}

async function loadSsrEntryModule(vite: ViteDevServer | null) {
  if (isProd) {
    // 生产直接拿打包后的地址
    const entryPath = path.join(cwd, 'dist/server/entry-server.js')
    return require(entryPath)
  } else {
    // 开发通过 no-bundle 方式加载
    const entryPath = path.join(cwd, 'src/entry-server.tsx')
    return vite!.ssrLoadModule(entryPath)
  }
}

// 返回模板地址路径
function resolveTemplatePath() {
  if (isProd) {
    return path.join(cwd, 'dist/client/index.html')
  } else {
    return path.join(cwd, 'index.html')
  }
}

// 校验地址
function matchPageUrl(url: string) {
  if (url === '/') return true
  return false
}

// 创建服务
async function createServer() {
  const app = express()
  app.use(await createSsrMiddleware(app))

  // 注册中间件，生产环境端处理客户端资源
  if(isProd){
    
    app.use(serve(path.join(cwd, 'dist/client')))
  }
  app.listen(4000, () => {
    console.log('Node 服务器已启动~')
    console.log('http://localhost:4000')
  })
}

createServer()
