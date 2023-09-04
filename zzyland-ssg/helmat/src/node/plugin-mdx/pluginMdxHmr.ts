import { Plugin } from 'vite'
import assert from 'assert'

export function pluginMdxHmr(): Plugin {
  let viteReactPlugin: Plugin
  return {
    name: 'vite-plugin-mdx-hmr',
    apply: 'serve',
    configResolved(config) {
      viteReactPlugin = config.plugins.find(
        (p) => p.name === 'vite:react-babel'
      ) as Plugin
    },
    async transform(code, id, opts) {
      if (/\.mdx?$/.test(id)) {
        assert(typeof viteReactPlugin.transform === 'function')
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
          result!.code += selfAcceptCode
        }
        return result
      }
    },
    handleHotUpdate(ctx) {
      if (/\.mdx?/.test(ctx.file)) {
        const location = ctx.server.httpServer._connectionKey.slice('2')
        const path = ctx.file.slice(ctx.server.config.root.length)

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
