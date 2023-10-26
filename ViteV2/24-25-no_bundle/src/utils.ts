import os from 'os'
import path from 'path'

export const slash = (p) => {
  return p.replace(/\\/g, '/')
}

export const isWindows = os.platform() === 'win32'

export const normalizePath = (id: string): string =>
  path.posix.normalize(isWindows ? slash(id) : id)
