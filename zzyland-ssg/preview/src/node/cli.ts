import { cac } from 'cac'
import { resolve } from 'path'
import { build } from './build'
import { resolveConfig } from './config'
import { preview } from './preview'

const version = require('../../package.json').version

const cli = cac('zisland').version(version).help()

cli.command('dev [root]', 'zisland dev server').action(async (root: string) => {
  const createServer = async () => {
    root = root ? resolve(root) : process.cwd()
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
  .command('build [root]', 'zisland build development')
  .action(async (root: string) => {
    try {
      root = resolve(root)
      const config = await resolveConfig(root, 'build', 'production')
      await build(root, config)
    } catch (e) {
      console.log('err', e)
    }
  })

cli
  .command('preview [root]', 'preview build of production')
  .option('--port <port>', 'port to use for preview server')
  .action(async (root: string, { port }: { port?: number }) => {
    try {
      root = resolve(root)
      await preview(root, port)
    } catch (e) {
      console.log('err', e)
    }
  })

cli.parse()
