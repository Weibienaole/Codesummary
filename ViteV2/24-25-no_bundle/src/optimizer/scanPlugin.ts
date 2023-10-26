import { Plugin } from 'esbuild'
import { BARE_IMPORT_RE, EXTERNAL_TYPES } from '../constant'

export async function scanPlugins(deps: Set<string>): Promise<Plugin> {
  return Promise.resolve({
    name: 'plugin:scan',
    setup(build) {
      build.onResolve(
        {
          filter: new RegExp(`\\.(${EXTERNAL_TYPES.join('|')})$`)
        },
        // 将指定类型文件排除。
        ({ path }) => {
          return {
            path,
            external: true
          }
        }
      )
      // 记录依赖
      build.onResolve({ filter: BARE_IMPORT_RE }, (resolveInfo) => {
        const { path: id } = resolveInfo
        deps.add(id)
        return {
          path: id,
          external: true
        }
      })
    }
  })
}
