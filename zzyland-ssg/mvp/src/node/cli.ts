import { cac } from 'cac'
import * as path from 'path'
import * as fs from 'fs-extra'
import type { RollupOutput } from 'rollup'
import createDevServer from './dev'
import { build } from './build'

const version = require('../../package.json').version

const cli = cac('zisland').version(version).help()

cli.command('dev [root]', 'zisland dev server').action(async (root: string) => {
  root = root ? path.resolve(root) : process.cwd()
  const server = await createDevServer(root)
  await server.listen()
  server.printUrls()
})

cli
  .command('build [node]', 'zisland build development')
  .action(async (root: string) => {
    try {
      root = path.resolve(root)
      const [clientBoundle, serverBoundle] = await build(root)
      const serverEnterPath = path.join(root, 'runtime', 'ssr-entry.tsx')
      const { render } = require(serverEnterPath)
      await renderPage(render, root, clientBoundle)
    } catch (e) {
      console.log('err', e)
    }
  })

cli.parse()

async function renderPage(
  render: () => string,
  root: string,
  boundle: RollupOutput
) {
  
}
