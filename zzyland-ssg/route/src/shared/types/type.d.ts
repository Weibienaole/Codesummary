declare module 'zisland:site-data' {
  import type { UserConfig } from 'shared/types'
  const siteData: UserConfig
  export default siteData
}

declare module 'zisland:routes' {
  import { RouteObject } from 'react-router-dom'
  const routes: RouteObject
  export { routes }
}
