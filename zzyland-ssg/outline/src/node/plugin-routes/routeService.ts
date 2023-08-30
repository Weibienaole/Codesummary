import fastGlob from 'fast-glob'
import path from 'path'
import { normalizePath } from 'vite'

interface RouteMeta {
  routePath: string
  absolutePath: string
}

class RouteService {
  #scanDir: string
  #routeData: RouteMeta[] = []
  constructor(scanDir: string) {
    this.#scanDir = scanDir
  }
  init() {
    const files = fastGlob
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        absolute: true,
        cwd: this.#scanDir,
        ignore: ['**/node_modules/**', '**/build/**', 'config.ts']
      })
      .sort()

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
    const routePath = path.replace(/\.(.*)?$/, '').replace(/index$/, '')
    return routePath.startsWith('/') ? routePath : `/${routePath}`
  }
  generateRoutesCode(ssr: boolean) {
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
