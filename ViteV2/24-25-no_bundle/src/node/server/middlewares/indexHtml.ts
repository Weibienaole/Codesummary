import path from 'path'
import fs from 'fs-extra'

import { ServerContext } from '../index'
import { NextHandleFunction } from 'connect';

export function indexHtmlMiddleware(serverContext: ServerContext): NextHandleFunction {
  return async (req, res, next) => {
    if (req.url === '/') {
      const { root } = serverContext
      const indexFilePath = path.join(root, 'index.html')
      
      if (await fs.pathExistsSync(indexFilePath)) {
        const rawHtml = await fs.readFileSync(indexFilePath, 'utf-8')
        let html = rawHtml
        for(const plugin of serverContext.plugins){
          if(plugin.transformIndexHtml){
            html = await plugin.transformIndexHtml(html)
          }
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        return res.end(html)
      }
    }
    return next()
  }
}
