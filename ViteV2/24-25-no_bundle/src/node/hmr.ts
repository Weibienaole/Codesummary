import { blue, green } from 'picocolors'
import { ServerContext } from './server'
import { getShortName } from './utils'

export function bindingHMREvents(serverContext: ServerContext) {
  const { ws, watcher, root } = serverContext
  watcher.on('change', async (file) => {
    const { moduleGraph } = serverContext
    moduleGraph.invaliDateModule(file)
    // 长连接发送更新内容，为当前模块为边界的更新
    ws.send({
      type: 'update',
      updates: [
        {
          type: 'js-update',
          timestamp: Date.now(),
          path: '/' + getShortName(file, root),
          acceptedPath: '/' + getShortName(file, root)
        }
      ]
    })
  })
}
