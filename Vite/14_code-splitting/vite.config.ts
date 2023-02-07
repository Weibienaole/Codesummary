import react from '@vitejs/plugin-react'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'

const chunkGroups = {
  'react-vendor': [require.resolve('react'), require.resolve('react-dom')]
}

function manualChunks(id, { getModuleInfo }) {
  for (const group of Object.keys(chunkGroups)) {
    const deps = chunkGroups[group]
    if (
      id.includes('node_modules') &&
      inDepIncludes(id, deps, [], getModuleInfo)
    ) {
      return group
    }
  }
}
const cache = new Map()

// 向上递归检索是否有引用者
function inDepIncludes(
  id: string,
  depPaths: string[],
  importChain: string[],
  getModuleInfo
): boolean | undefined {
  const key = `${id}-${depPaths.join('|')}`
  const moduleInfo = getModuleInfo(id)
  // 循环调用，直接返回false
  if (importChain.includes(id)) {
    cache.set(key, false)
    return false
  }
  // 缓存内有则直接返回缓存的值
  if (cache.has(key)) {
    return cache.get(key)
  }
  // 当前地址被命中
  if (depPaths.includes(id)) {
    // 将依赖数组内的所有文件都存入缓存
    importChain.forEach((importer) =>
      cache.set(`${importer}-${depPaths.join('|')}`, true)
    )
    return true
  }
  // 没有这个模块的信息，或者这个模块没有引用者，return fasle，并记录在缓存中
  if (!moduleInfo || !moduleInfo.importers) {
    cache.set(key, false)
    return false
  }
  // 向上检索，只要有一个命中即返回true
  const isModuleCludes = moduleInfo.importers.some((importer) =>
    inDepIncludes(importer, depPaths, [...importChain, id], getModuleInfo)
  )
  cache.set(key, isModuleCludes)
  return isModuleCludes
}

export default {
  plugins: [
    react(),
    // 直接使用插件
    chunkSplitPlugin({
      //  指定拆包策略
      customSplitting: {
        // 支持包名
        'react-ventor': ['react', 'react-dom'],
        // 或者正则 src 中 components 和 utils 下的所有文件被会被打包为`component-util`的 chunk 中
        'components-util': [/src\/components/, /src\/utils/]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // 自定义拆包策略-对象
        // manualChunksObj: {
        //   // 将 React 相关库打包成单独的 chunk 中
        //   'react-vendor': ['react', 'react-dom'],
        //   // 将 Lodash 库的代码单独打包
        //   lodash: ['lodash-es'],
        //   // 将组件库的代码打包
        //   library: ['antd', '@arco-design/web-react']
        // },
        // 函数  这样有缺陷，会造成循环引用
        // manualChunks(id){
        //   if(id.includes('react')){
        //     return 'react-vendor'
        //   }
        //   if(id.includes('lodash-es')){
        //     return 'lodash'
        //   }
        //   if(id.includes('antd') || id.includes('@arco-design/web-react')){
        //     return 'library'
        //   }
        // }
        // manualChunks
      }
    }
  }
}
