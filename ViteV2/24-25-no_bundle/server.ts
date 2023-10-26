import connect from 'connect'
import { blue, green } from 'picocolors'
import { optimizer } from './src/optimizer'


export const startDevServer = async () => {
  const app = connect()
  const root = process.cwd()
  const startTime = Date.now()
  app.listen(3000, async () => {
    await optimizer(root)
    console.log(
      green('🚀 No-Bundle 服务已经成功启动!'),
      `耗时：${Date.now() - startTime} ms`
    )
    console.log(`> 本地访问路径: ${blue('http://localhost:3000')}`)
  })
}
