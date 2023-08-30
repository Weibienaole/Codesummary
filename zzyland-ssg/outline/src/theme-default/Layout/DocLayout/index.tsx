import { Content, usePageData } from '@runtime'
import { useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import styles from './index.module.scss'
import DocFooter from '../../components/DocFooter'

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
      <div className={styles.content}>
        <div>
          <div className="zisland-doc">
            <Content />
          </div>
          <DocFooter />
        </div>
      </div>
    </div>
  )
}

export default DocLayout
