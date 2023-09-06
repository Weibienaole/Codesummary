import { createRoot, hydrateRoot } from 'react-dom/client'
import { ComponentType } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { App, initPageData } from './App'
import { DataContext } from './hooks'

declare global {
  interface Window {
    ZISLANDS: Record<string, ComponentType<unknown>>
    ZISLAND_PROPS: unknown[]
  }
}

async function renderInBrowser() {
  const containerEl = document.getElementById('root')
  if (!containerEl) {
    throw new Error('#root element not found')
  }

  if (import.meta.env.DEV) {
    const pageData = await initPageData(location.pathname)
    createRoot(containerEl).render(
      <HelmetProvider>
        <DataContext.Provider value={pageData}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DataContext.Provider>
      </HelmetProvider>
    )
  } else {
    const zislands = document.querySelectorAll('[__zisland]')
    if (zislands.length === 0) {
      return
    }
    for (const zisland of zislands) {
      const [id, index] = zisland.getAttribute('__zisland').split(':')
      const Element = window.ZISLANDS[id] as ComponentType<unknown>
      hydrateRoot(zisland, <Element {...window.ZISLAND_PROPS[index]} />)
    }
  }
}

renderInBrowser()
