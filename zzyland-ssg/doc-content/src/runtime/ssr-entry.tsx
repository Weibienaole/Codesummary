import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

import { App } from './App'

export function render(pagePath) {
  return renderToString(
    <StaticRouter location={pagePath}>
      <App />
    </StaticRouter>
  )
}

export { routes } from 'zisland:routes'
