import { usePageData } from '@runtime'
import { useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

const DocLayout = () => {
  const { siteData } = usePageData()
  const location = useLocation()
  const sidebar = siteData.themeConfig?.sidebar || {}

  const { pathname } = location
  const findTargetKey = Object.keys(sidebar).find((key) =>
    pathname.startsWith(key)
  )

  const targetSideBar = sidebar[findTargetKey] || []

  return (
    <div>
      <Sidebar sidebar={targetSideBar} pathname={pathname} />
    </div>
  )
}

export default DocLayout
