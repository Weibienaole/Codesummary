import { NextHandleFunction } from 'connect'
import sirv from 'sirv'
import { isImportRequest } from '../../utils'

export function staticMiddleware(root: string): NextHandleFunction {
  const serverFormRoot = sirv(root, { dev: true })
  return async (req, res, next) => {
    if (!req.url) {
      return
    }
    if (isImportRequest(req.url)) {
      return
    }
    serverFormRoot(req, res, next)
  }
}
