import { useRoutes } from 'react-router-dom'

import A from '../../docs/guide/a'
import Index from '../../docs/guide/index'
import B from '../../docs/b'

const routes = [
  {
    path: '/guide/a',
    element: <A />
  },
  {
    path: '/b',
    element: <B />
  },
  {
    path: '/guide',
    element: <Index />
  }
]

export const Content = () => {
  const routeElements = useRoutes(routes)
  return routeElements
}
