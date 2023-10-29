import connect from 'connect'
import { blue, green } from 'picocolors'
import chokidar, { FSWatcher } from 'chokidar'

import { optimizer } from '../optimizer'
import { Plugin } from '../plugin'
import { PluginContainer, createPluginContainer } from '../pluginContainer'
import { resolvePlugins } from '../plugins'
import { indexHtmlMiddleware } from './middlewares/indexHtml'
import { transformMiddleware } from './middlewares/trasnform'
import { staticMiddleware } from './middlewares/static'
import { ModuleGraph } from '../ModuleGraph'
import { normalizePath } from '../utils'
import { createWebSocketServer } from '../ws'
import { bindingHMREvents } from '../hmr'

export interface ServerContext {
  root: string
  pluginContainer: PluginContainer
  app: connect.Server
  plugins: Plugin[]
  moduleGraph: ModuleGraph
  ws: { send: (data: any) => void; close: () => void }
  watcher: FSWatcher
}

export const startDevServer = async () => {
  const app = connect()
  const root = process.cwd()
  const startTime = Date.now()

  const plugins = resolvePlugins()
  const pluginContainer = createPluginContainer(plugins)

  const moduleGraph = new ModuleGraph((url) => pluginContainer.resolveId(url))

  const watcher = chokidar.watch(root, {
    ignored: ['**/node_modules/**', '**/.git/**'],
    ignoreInitial: true
  })

  const ws = createWebSocketServer(app)

  const serverContext: ServerContext = {
    root: normalizePath(process.cwd()),
    app,
    pluginContainer,
    plugins,
    moduleGraph,
    ws,
    watcher
  }

  for (const plugin of plugins) {
    if (plugin.configureServer) {
      await plugin.configureServer(serverContext)
    }
  }

  // hmr注册
  bindingHMREvents(serverContext)
  // 入口文件
  app.use(indexHtmlMiddleware(serverContext))
  // code转换
  app.use(transformMiddleware(serverContext))
  // 链接类型静态资源接入
  app.use(staticMiddleware(serverContext.root))

  app.listen(3000, async () => {
    // 1.预构建
    await optimizer(root)
    console.log(
      green('🚀 No-Bundle 服务已经成功启动!'),
      `耗时：${Date.now() - startTime} ms`
    )
    console.log(`> 本地访问路径: ${blue('http://localhost:3000')}`)
  })
}
