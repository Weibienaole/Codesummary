import { useEffect, useState } from 'react'
import { Header } from 'shared/types'

export const useHeaders = (initheaders: Header[]) => {
  const [headers, setHeadaers] = useState(initheaders)

  useEffect(() => {
    if (import.meta.env.DEV) {
      // 拦截自定义更新
      import.meta.hot.on(
        'mdx-changed',
        ({ filePath }: { filePath: string }) => {
          // 引入最新的file模块
          import(/* @vite-ignore */ `${filePath}?import&t=${Date.now()}`).then(
            (module) => {
              // 同步更新toc
              setHeadaers(module.toc)
            }
          )
        }
      )
    }
  })

  return headers
}
