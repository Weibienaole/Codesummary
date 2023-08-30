import { Content, usePageData } from '@runtime'
import 'uno.css'

import '../style/base.css'
import '../style/vars.css'
import Nav from '../components/Nav'
import HomeLayout from './HomeLayout'
import DocLayout from './DocLayout'

export function Layout() {
  const pageData = usePageData()

  const { pageType } = pageData
  // console.log(pageType)

  const renderContent = () => {
    if (pageType === 'home') {
      return <HomeLayout />
    } else if (pageType === 'doc') {
      return <DocLayout />
    } else if (pageType === 'custom') {
      return <div>custom</div>
    } else if (pageType === '404') {
      return <div>404</div>
    }
  }

  return (
    <div>
      <Nav />
      {renderContent()}
      {/* <Content /> */}
    </div>
  )
}
