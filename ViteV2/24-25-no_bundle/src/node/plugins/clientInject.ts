import path from 'path'
import fs from 'fs-extra'

import { CLIENT_PUBLIC_PATH, HMR_PORT } from '../../constant'
import { Plugin } from '../plugin'
import { ServerContext } from '../server'

export function clientInject(): Plugin {
  let serverContext: ServerContext
  return {
    name: 'm-vite:client-inject',
    configureServer(s) {
      serverContext = s
    },
    resolveId(id) {
      if (id === CLIENT_PUBLIC_PATH) {
        return { id }
      }
      return null
    },
    load(id) {
      if (id === CLIENT_PUBLIC_PATH) {
        const clientPath = path.join(
          serverContext.root,
          'node_modules',
          'mini-vite',
          'dist',
          'client.mjs'
        )
        const code = fs.readFileSync(clientPath, 'utf-8')
        return {
          code: code.replace('__HMR_PORT__', JSON.stringify(HMR_PORT))
        }
      }
    },
    transformIndexHtml(raw) {
      const newHtml = raw.replace(
        /(<head[^>]*>)/i,
        `$1
        <script type="module" src="${CLIENT_PUBLIC_PATH}"></script>`
      )
      return newHtml
    }
  }
}
