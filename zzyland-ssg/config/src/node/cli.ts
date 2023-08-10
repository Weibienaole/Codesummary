import { cac } from 'cac'
import * as path from 'path'
import { build } from './build'

const version = require('../../package.json').version

const cli = cac('zisland').version(version).help()

cli.command('dev [root]', 'zisland dev server').action(async (root: string) => {
  const createServer = async () => {
    root = root ? path.resolve(root) : process.cwd()
    const { createDevServer } = await import('./dev.js')
    const server = await createDevServer(root, async () => {
      await server.close()
      await createServer()
    })
    await server.listen()
    server.printUrls()
  }

  createServer()
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
