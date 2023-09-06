import { Helmet } from 'react-helmet-async'

import 'uno.css'
import '../style/base.css'
import '../style/vars.css'
import '../style/doc.css'
import { usePageData } from '@runtime'
import Nav from '../components/Nav'
import HomeLayout from './HomeLayout'
import DocLayout from './DocLayout'
import { NotFoundLayout } from './NotFoundLayout'

export function Layout() {
  const pageData = usePageData()
  const { pageType, title } = pageData

  const renderContent = () => {
    if (pageType === 'home') {
      return <HomeLayout />
    } else if (pageType === 'doc') {
      return <DocLayout />
    } else if (pageType === 'custom') {
      return <div>custom</div>
    } else if (pageType === '404') {
      return <NotFoundLayout />
    }
  }
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Nav />
      <section
        style={{
          paddingTop: 'var(--island-nav-height)'
        }}
      >
        {renderContent()}
      </section>
    </div>
  )
}
