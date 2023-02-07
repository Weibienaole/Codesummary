// 请求响应阶段的钩子
// 以下为服务启用和关闭的钩子

export const testHookPlugins = (option) => {
  return {
    name: 'test-hook-plugin1',
    // vite独有钩子
    config(config) {
      console.log('config阶段，可以任意修改config配置', config)
    },
    configResolved(resolvedConfig) {
      console.log(
        'configResolve阶段，返回配置的最终形式，用于获取，不用于修改',
        resolvedConfig
      )
    },
    // 通用钩子
    options(opts) {
      console.log('通用钩子', opts)
    },
    // vite dev server实例，添加中间价 独有钩子
    configureServer(server) {
      console.log('vite dev server实例', server)
      setTimeout(() => {
        // 杀死进程
        process.kill(process.pid, 'SIGTERM')
      }, 3000)
    },
    // 通用钩子 开始打包
    buildStart() {
      console.log('buildStart')
    },
    // 打包结束
    buildEnd() {
      console.log('buildEnd')
    },
    // 关闭服务
    closeBundle() {
      console.log('closeBundle')
    }
  }
}
