import { useState, useEffect, ReactElement, memo } from 'react'
import { withRouter } from 'react-router-dom'
import { getUrlData } from 'zzy-javascript-devtools'




function Singers(props): ReactElement {

  const [pageData, setPageData] = useState<object>({})
  useEffect(() => {
  }, [])

  return <div id="homePage_wrap">
    singers
  </div>
}

export default (memo(Singers))
