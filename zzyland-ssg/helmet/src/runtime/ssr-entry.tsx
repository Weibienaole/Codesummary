import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'

import { App, initPageData } from './App'
import { DataContext } from './hooks'

export interface RenderResult {
  appHtml: string
  zislandProps: unknown[]
  zislandToPathMap: Record<string, string>
}

export async function render(pagePath: string, helmetContext: object) {
  const pageData = await initPageData(pagePath)
  const { clearRuntimeData, data } = await import('./jsx-runtime')
  clearRuntimeData()
  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <DataContext.Provider value={pageData}>
        <StaticRouter location={pagePath}>
          <App />
        </StaticRouter>
      </DataContext.Provider>
    </HelmetProvider>
  )
  const { zislandProps, zislandToPathMap } = data
  return {
    appHtml,
    zislandProps,
    zislandToPathMap
  }
}

export { routes } from 'zisland:routes'
