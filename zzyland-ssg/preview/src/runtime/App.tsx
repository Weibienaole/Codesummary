import { PageData } from 'shared/types'
import { Layout } from '../theme-default'
import { routes } from 'zisland:routes'
import { matchRoutes } from 'react-router-dom'
import siteData from 'zisland:site-data'

// 接受当前页面的pagepath
export const initPageData = async (routePath: string): Promise<PageData> => {
  // 利用react-router-dom内的matchRoutes函数获取到当前path下的route内容，此内容在之前的生成路由插件中导出了额外的内容，包含preload函数
  const matched = matchRoutes(routes, routePath)
  if (matched) {
    // 引入当前页面内的所有导出
    const moduleInfo = await matched[0].route.preload()
    return {
      pagePath: routePath,
      pageType: moduleInfo.frontmatter?.pageType || 'doc', // 在mdx中定义的页面类型
      frontmatter: moduleInfo.frontmatter, // mdx中的内容项
      siteData: siteData, // 文档配置项内容
      toc: moduleInfo?.toc || [], // 右侧定位栏
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
