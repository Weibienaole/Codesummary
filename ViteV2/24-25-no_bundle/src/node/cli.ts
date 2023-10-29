import cac from 'cac'

import { startDevServer } from './server'

const root = process.cwd()

const cli = cac()

cli
  .command('[root]', 'Run the development server')
  .alias('server')
  .alias('dev')
  .action(async () => {
    await startDevServer()
  })

cli.help()

cli.parse()
