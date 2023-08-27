import { Content, usePageData } from '@runtime'
import 'uno.css'

export function Layout() {
  const pageData = usePageData()

  const { pageType } = pageData
  console.log(pageType)

  const renderContent = () => {
    if (pageType === 'home') {
      return <div>home</div>
    } else if (pageType === 'doc') {
      return <div>doc</div>
    } else if (pageType === 'custom') {
      return <div>custom</div>
    } else if (pageType === '404') {
      return <div>404</div>
    }
  }

  return (
    <div>
      {/* <h1 p="2" m="2" bg="[rgba(123,123,123,0.5)]">
        Layout View
      </h1> */}
      {/* <Content /> */}
      {renderContent()}
    </div>
  )
}
