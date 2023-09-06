import { Content, usePageData } from '@runtime'
import { useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import styles from './index.module.scss'
import DocFooter from '../../components/DocFooter'
import { Aside } from '../../components/Aside'

const DocLayout = () => {
  const { siteData, toc } = usePageData()
  const location = useLocation()
  const sidebar = siteData.themeConfig?.sidebar || {}

  const { pathname } = location

  const findTargetKey = Object.keys(sidebar).find((key) =>
    (pathname.endsWith('/') ? pathname : pathname + '/').startsWith(key)
  )

  const targetSideBar = sidebar[findTargetKey] || []

  return (
    <div>
      <Sidebar sidebar={targetSideBar} pathname={pathname} />
      <div className={styles.content} flex="~">
        +{' '}
        <div className={styles.docContent}>
          <div className="zisland-doc">
            <Content />
          </div>
          <DocFooter />
        </div>
        <div className={styles.asideContainer}>
          <Aside headers={toc} __zisland />
        </div>
      </div>
    </div>
  )
}

export default DocLayout
