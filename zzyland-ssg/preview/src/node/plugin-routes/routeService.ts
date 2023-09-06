import fastGlob from 'fast-glob'
import path from 'path'
import { normalizePath } from 'vite'

interface RouteMeta {
  routePath: string
  absolutePath: string
}

class RouteService {
  // 扫描路径
  #scanDir: string
  #routeData: RouteMeta[] = []
  constructor(scanDir: string) {
    this.#scanDir = scanDir
  }
  init() {
    // 检索并返回指定类型的文件信息
    const files = fastGlob
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        absolute: true, // 绝对路径
        cwd: this.#scanDir,
        ignore: ['**/node_modules/**', '**/build/**', 'config.ts'] // 排除项
      })
      .sort() // 规范化排序

    files.map((file) => {
      const fileRelativePath = normalizePath(path.relative(this.#scanDir, file))
      const routePath = this.normallizeRoutePath(fileRelativePath)
      this.#routeData.push({
        routePath,
        absolutePath: file
      })
    })
  }
  getRouteMeta(): RouteMeta[] {
    return this.#routeData
  }
  normallizeRoutePath(path: string) {
    // 去除后缀 guide/a.tsx --- guide/a
    const routePath = path.replace(/\.(.*)?$/, '').replace(/index$/, '')
    return routePath.startsWith('/') ? routePath : `/${routePath}`
  }
  generateRoutesCode(ssr: boolean) {
    // 客户端进行组件的按需加载，导出块时加入preload函数，返回此文件内的所有导出，包含默认导出代码块以及其他一些附着在文件内数据的导出
    return `
      import React from 'react'
      ${ssr ? '' : 'import loadable from "@loadable/component"'}

      ${this.#routeData
        .map((route, index) =>
          ssr
            ? `import Route${index} from '${route.absolutePath}'`
            : `const Route${index} = loadable(() => import('${route.absolutePath}'))`
        )
        .join('\n')}

      export const routes = [
        ${this.#routeData
          .map(
            (route, index) =>
              `{ path: '${route.routePath}', element: React.createElement(Route${index}), preload: () => import('${route.absolutePath}') }`
          )
          .join(',\n')}
      ]
    `
  }
}

export default RouteService
