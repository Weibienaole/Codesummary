import { Plugin } from 'vite'
import RouteService from './routeService'

interface PluginOptions {
  root: string
  isSSR: boolean
}

export interface Route {
  path: string
  element: React.ReactElement
  filePath: string
}

export const PLUGON_ROUTES_ID = 'zisland:routes'

const pluginRoutes = (options: PluginOptions): Plugin => {
  const routerService = new RouteService(options.root)

  return {
    name: 'zisland:routes',
    async configResolved() {
      await routerService.init()
    },
    resolveId(id: string) {
      if (id === PLUGON_ROUTES_ID) {
        return '\0' + id
      }
    },
    load(id: string) {
      if (id === '\0' + PLUGON_ROUTES_ID) {
        return routerService.generateRoutesCode(options.isSSR || false)
      }
    }
  }
}

export default pluginRoutes
