import { createRoot, hydrateRoot } from 'react-dom/client'
import { App, initPageData } from './App'
import { BrowserRouter } from 'react-router-dom'
import { DataContext } from './hooks'
import { ComponentType } from 'react'

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
      <DataContext.Provider value={pageData}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DataContext.Provider>
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
