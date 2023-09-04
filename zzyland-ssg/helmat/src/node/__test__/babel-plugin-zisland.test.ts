import { expect, describe, test } from 'vitest'
import { TransformOptions, transformAsync } from '@babel/core'
import os from 'os'
import babelPluginZisland from '../babel-plugin-zisland'
import { MASK_SPLITTER } from '../constants'

const isWindows = os.platform() === 'win32'

describe('babel-plugin-zisland', () => {
  const ZISLNAD_PATH = '../Comp/index'
  const prefix = isWindows ? 'C:' : ''
  const IMPORTER_PATH = prefix + '/User/project/test.tsx'
  const babelOptions: TransformOptions = {
    filename: IMPORTER_PATH,
    presets: ['@babel/preset-react'],
    plugins: [babelPluginZisland]
  }

  test('should compile jsx identifier', async () => {
    const code = `import A from '${ZISLNAD_PATH}';export default function App() { return <A.B.C __zisland />; }`

    const result = await transformAsync(code, babelOptions)
    expect(result?.code).toContain(
      `__zisland: "${ZISLNAD_PATH}${MASK_SPLITTER}${IMPORTER_PATH}"`
    )
  })
})
