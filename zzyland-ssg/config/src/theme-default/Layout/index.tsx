import { useState } from 'react'
import siteConfig from 'zisland:site-data'

export function Layout() {
  const [count, setCount] = useState(0)
  console.log(siteConfig, 'siteConfig')

  return (
    <div>
      <h1>This is Layouts Compsonsssent</h1>
      <div>
        {count}
        <button onClick={() => setCount(count + 1)}>Add Count</button>
      </div>
    </div>
  )
}
