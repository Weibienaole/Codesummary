import { usePageData } from '@runtime'
import { useLocation } from 'react-router-dom'
import { SidebarItem } from 'shared/types'

const useNextPrevPage = () => {
  const { pathname } = useLocation()
  const { siteData } = usePageData()
  const sidebarData = siteData.themeConfig?.sidebar || {}

  const flattenTitles: SidebarItem[] = []

  Object.keys(sidebarData).forEach((key) => {
    const groups = sidebarData[key]
    groups.forEach((group) => {
      group.items.forEach((item) => {
        flattenTitles.push(item)
      })
    })
  })

  const findTargetPathIdx = flattenTitles.findIndex(
    (item) => item.link === pathname
  )

  const nextPage = flattenTitles[findTargetPathIdx + 1] || null
  const prevPage = flattenTitles[findTargetPathIdx - 1] || null

  return { nextPage, prevPage }
}

export default useNextPrevPage
