import { PageData } from 'shared/types'
import { Layout } from '../theme-default'
import { routes } from 'zisland:routes'
import { matchRoutes } from 'react-router-dom'
import siteData from 'zisland:site-data'
// import siteConfig from 'zisland:site-data'

export const initPageData = async (routePath: string): Promise<PageData> => {
  const matched = matchRoutes(routes, routePath)
  if (matched) {
    const moduleInfo = await matched[0].route.preload()
    return {
      pagePath: routePath,
      pageType: moduleInfo.frontmatter?.pageType || 'doc',
      frontmatter: moduleInfo.frontmatter,
      siteData: siteData,
      toc: moduleInfo?.toc || [],
      title: moduleInfo?.title || ''
    }
  } else {
    return {
      pagePath: routePath,
      pageType: '404',
      frontmatter: {},
      siteData,
      toc: [],
      title: '404'
    }
  }
}

export function App() {
  // console.log(siteConfig, 'siteConfig')
  return <Layout />
}
