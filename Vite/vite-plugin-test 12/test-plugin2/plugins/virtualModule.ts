import { Plugin, ResolvedConfig } from 'vite'

// 虚拟模块id
const virtualFibModuleId = 'virtual:fib'
// vite中约定，虚拟模块的前缀为 /0
const resolveVirtualFibModuleId = '/0' + virtualFibModuleId

const virtualEnvModuleId = 'virtual:env'
const resolveVirtualEnvModuleid = '/0' + virtualEnvModuleId

export default function virtualFibModulePlugin(): Plugin {
  let config: ResolvedConfig | null = null
  return {
    name: 'vite-plugin-virtual-module',
    configResolved(c: ResolvedConfig) {
      config = c
    },
    resolveId(id) {
      // 找到符合虚拟模块地址的id，进行替换
      if (id === virtualFibModuleId) {
        return resolveVirtualFibModuleId
      }
      if (id === virtualEnvModuleId) {
        return resolveVirtualEnvModuleid
      }
    },
    load(id) {
      // 找到符合虚拟模块地址的id，进行自定义输出
      if (id === resolveVirtualFibModuleId) {
        return 'export default function fib(n){console.log(n, "nnn")}'
      }
      // 找到符合虚拟模块地址的id，返回配置中env的值
      if (id === resolveVirtualEnvModuleid) {
        return `export default ${JSON.stringify(config!.env)}`
      }
    }
  }
}
