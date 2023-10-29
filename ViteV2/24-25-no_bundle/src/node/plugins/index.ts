import { Plugin } from '../plugin'
import { assetsPlugin } from './assets'
import { clientInject } from './clientInject'
import { cssPlugin } from './css'
import { esBuildTrasnform } from './esbuild'
import { importAnalysis } from './importAnalysis'
import { resolvePlugin } from './resolve'
export function resolvePlugins(): Plugin[] {
  return [
    clientInject(),
    resolvePlugin(),
    esBuildTrasnform(),
    importAnalysis(),
    cssPlugin(),
    assetsPlugin()
  ]
}
