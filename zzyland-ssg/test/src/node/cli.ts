import { cac } from 'cac'
import * as path from 'path'
import { build } from './build'
import createDevServer from './dev'

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
      build(root)
    } catch (e) {
      console.log('err', e)
    }
  })

cli.parse()
