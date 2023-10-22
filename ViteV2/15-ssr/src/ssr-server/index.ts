// 后端服务
import express, { RequestHandler, Express } from 'express'
import { ViteDevServer } from 'vite'
import * as path from 'path'
import * as fs from 'fs'
import { fetchFn } from '../entry-server'
import { renderToString } from 'react-dom/server'
import React from 'react'

const isProd = import.meta.env.PROD

const cwd = process.cwd()

async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
  let vite: ViteDevServer | null = null
  if (!isProd) {
    vite = await (
      await require('vite')
    ).createServer({
      root: process.cwd(),
      server: {
        middlewareMode: 'ssr'
      }
    })
  }
  app.use((vite as ViteDevServer).middlewares)
  return async (req, res, next) => {
    const url = req.originalUrl
    const { ServerEntry } = loadSsrEntryModule(vite)

    const data = await fetchFn()

    const appHtml = renderToString(React.createElement(ServerEntry, { data }))

    const templatePath = resolveTemplatePath()
    let template = await fs.readFileSync(templatePath, 'utf-8')
    if (!isProd && vite) {
      template = vite?.transformIndexHtml(url, template)
    }
    const html = template
      .replace('<!-- SSR_APP -->', appHtml)
      .replace(
        '<!-- SSR_DATA -->',
        `<script>window.__SSR_DATA = ${JSON.stringify(data)}</script>`
      )
    res.status(200).setHeader('Content-Type', 'text/html').end(html)
  }
}

async function loadSsrEntryModule(vite: ViteDevServer | null) {
  if (isProd) {
    const modulePath = path.join(cwd, 'dist/server/entry-server.js')
    return require(modulePath)
  } else {
    const entryPath = path.join(cwd, 'src/entry-server.tsx')
    return vite!.ssrLoadModule(entryPath)
  }
}

function resolveTemplatePath() {
  return isProd
    ? path.join(cwd, 'dist/client/index.html')
    : path.join(cwd, 'index.html')
}

async function createServer() {
  const app = express()

  app.use(await createSsrMiddleware(app))

  app.listen(3000, () => {
    console.log('Node 服务器已启动~')
    console.log('http://localhost:3000')
  })
}

createServer()
