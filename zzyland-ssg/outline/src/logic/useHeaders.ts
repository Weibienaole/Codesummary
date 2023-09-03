import { useEffect, useState } from 'react'
import { Header } from 'shared/types'

export const useHeaders = (initheaders: Header[]) => {
  const [headers, setHeadaers] = useState(initheaders)

  useEffect(() => {
    if (import.meta.env.DEV) {
      import.meta.hot.on(
        'mdx-changed',
        ({ filePath }: { filePath: string }) => {
          import(/* @vite-ignore */ `${filePath}?import&t=${Date.now()}`).then(
            (module) => {
              setHeadaers(module.toc)
            }
          )
        }
      )
    }
  })

  return headers
}
