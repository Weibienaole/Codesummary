import path from 'path'
import { resolveConfig } from './config'
import sirv from 'sirv'
import compression from 'compression'
import polka from 'polka'
import fs from 'fs-extra'

export const preview = async (root: string, port: number) => {
  const config = await resolveConfig(root, 'serve', 'production')
  const outputDir = path.resolve(root, 'build')
  const listenPort = port || 9000
  const notFoundFile = fs.readFileSync(
    path.resolve(outputDir, '404.html'),
    'utf-8'
  )
  const compress = compression()

  const serve = sirv(outputDir, {
    etag: true,
    maxAge: 31536000,
    immutable: true,
    setHeaders(res, pathname) {
      if (pathname.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache')
      }
    }
  })

  // 加入404页面
  const onNoMatch: polka.Options['onNoMatch'] = (req, res) => {
    res.statusCode = 404
    res.end(notFoundFile)
  }
  polka({ onNoMatch })
    .use(compress, serve)
    .listen(listenPort, (err) => {
      if (err) {
        throw err
      }
      console.log(
        'preview build for production: http://localhost:' + listenPort
      )
    })
}
