import { Plugin } from 'vite'
import assert from 'assert'

export function pluginMdxHmr(): Plugin {
  let viteReactPlugin: Plugin
  return {
    name: 'vite-plugin-mdx-hmr',
    apply: 'serve',
    configResolved(config) {
      // 获取到热更新插件
      viteReactPlugin = config.plugins.find(
        (p) => p.name === 'vite:react-babel'
      ) as Plugin
    },
    async transform(code, id, opts) {
      if (/\.mdx?$/.test(id)) {
        // 断言工具函数 等同if，false时会中断运行
        assert(typeof viteReactPlugin.transform === 'function')
        // 利用插件手动进行代码的转换
        const result = await viteReactPlugin.transform?.call(
          this,
          code,
          id + '?.jsx', // 运行时会因为jsx的后缀进行React的hmr注入
          opts
        )
        const selfAcceptCode = 'import.meta.hot.accept();'
        if (
          typeof result === 'object' &&
          !result!.code?.includes(selfAcceptCode)
        ) {
          // 不包含 accept 函数的code进行手动注入
          result!.code += selfAcceptCode
        }
        return result
      }
    },
    // 将正文页面与toc导航栏挂钩，新增标题标签可以同步热更新至toc
    handleHotUpdate(ctx) {
      if (/\.mdx?/.test(ctx.file)) {
        // 这个地方有一些歧义，使用原本的 ctx.file 会导致对不上。
        // 这里获取到ctx的元数据进行组装
        const location = ctx.server.httpServer._connectionKey.slice('2')
        const path = ctx.file.slice(ctx.server.config.root.length)

        // 发送自定义热更新
        ctx.server.ws.send({
          type: 'custom',
          event: 'mdx-changed',
          data: {
            filePath: 'http://' + location + path
          }
        })
      }
    }
  }
}
