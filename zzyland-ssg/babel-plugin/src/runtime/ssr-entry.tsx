import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

import { App, initPageData } from './App'
import { DataContext } from './hooks'

export interface RenderResult {
  appHtml: string
  propsData: unknown[]
  zislandToPathMap: Record<string, string>
}

export async function render(pagePath) {
  const pageData = await initPageData(pagePath)
  const { clearRuntimeData, data } = await import('./jsx-runtime')

  const { zislandProps, zislandToPathMap } = data
  clearRuntimeData()
  const appHtml = renderToString(
    <DataContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
        <App />
      </StaticRouter>
    </DataContext.Provider>
  )
  return {
    appHtml,
    zislandProps,
    zislandToPathMap
  }
}

export { routes } from 'zisland:routes'
