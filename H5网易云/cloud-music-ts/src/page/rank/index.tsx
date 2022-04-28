import { useState, useEffect, ReactElement, memo } from 'react'
import { withRouter } from 'react-router-dom'
import { getUrlData } from 'zzy-javascript-devtools'

// import './index.css'


function Rank(props): ReactElement {

  const [pageData, setPageData] = useState<object>({})
  useEffect(() => {
  }, [])

  return <div id="homePage_wrap">rank
  </div>
}

export default (memo(Rank))
