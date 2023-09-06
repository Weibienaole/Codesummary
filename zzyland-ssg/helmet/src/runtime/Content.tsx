import { useRoutes } from 'react-router-dom'

import { routes } from 'zisland:routes'

export const Content = () => {
  const routeElements = useRoutes(routes)
  return routeElements
}
