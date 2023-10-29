import os from 'os'
import path from 'path'
import { HASH_RE, JS_TYPES_RE, QEURY_RE } from '../constant'

export const slash = (p) => {
  return p.replace(/\\/g, '/')
}

export const isWindows = os.platform() === 'win32'

export const normalizePath = (id: string): string =>
  path.posix.normalize(isWindows ? slash(id) : id)

export const cleanUrl = (url: string): string =>
  url.replace(HASH_RE, '').replace(QEURY_RE, '')

export const isRequestJs = (id: string): boolean => {
  id = cleanUrl(id)
  if (JS_TYPES_RE.test(id)) {
    return true
  }
  if (!path.extname(id) && !id.endsWith('/')) {
    return true
  }
  return false
}

export const isRequestCss = (id: string): boolean =>
  cleanUrl(id).endsWith('.css')

export const isImportRequest = (url: string): boolean => {
  return url.endsWith('?import')
}

export const getShortName = (file: string, root: string) => {
  return file.startsWith(root + '/') ? path.posix.relative(root, file) : file
}

export const removeImportQuery = (url: string): string => {
  return url.replace(/\?import$/, '')
}
