import { InlineConfig, build as viteBuild } from 'vite'
import reactPlugin from '@vitejs/plugin-react'
import { RollupOutput } from 'rollup'
import { pathToFileURL } from 'url'
import * as path from 'path'
import fs from 'fs-extra'

import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants'

const dynamicImport = new Function('m', 'return import(m)')

export async function build(root = process.cwd()) {
  // 分别打包client和server代码
  const [clientBoundle] = await boundle(root)

  // 引入SSR模块
  root = path.resolve(root)
  const serverEnterPath = path.join(root, '.temp', 'ssr-entry.js')
  // 服务端渲染，产出
  const { render } = await import(pathToFileURL(serverEnterPath).toString())
  await renderPage(render, root, clientBoundle)
}

export async function boundle(root: string) {
  try {
    const resolveViteBuildConfig = (isServe: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        plugins: [reactPlugin()],
        build: {
          assetsDir: '',
          ssr: isServe,
          outDir: isServe ? '.temp' : 'build',
          rollupOptions: {
            input: isServe ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: isServe
              ? {
                  format: 'cjs',
                  entryFileNames: '[name].js'
                }
              : {
                  format: 'esm',
                  entryFileNames: '[name].js'
                }
          }
        }
      }
    }

    console.log('Building client + server bundles...')
    const clientBuild = async () => {
      return viteBuild(resolveViteBuildConfig(false))
    }
    const serverBuild = async () => {
      return viteBuild(resolveViteBuildConfig(true))
    }
    const [clientBoundle, serverBoundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ])

    return [clientBoundle, serverBoundle] as [RollupOutput, RollupOutput]
  } catch (e) {
    console.log('err', e)
  }
}

async function renderPage(
  render: () => string,
  root: string,
  boundle: RollupOutput
) {
  const clientChunk = boundle.output.find(
    (chunk) => chunk.isEntry && chunk.type === 'chunk'
  )
  // console.log('renderPage', clientChunk)
  const { default: ora } = await dynamicImport('ora')
  const spinner = ora()
  spinner.start('Rendering page in server side...')
  const appHtml = render()
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    </body>
    <script type="module" src="/${clientChunk?.fileName}"></script>
    </html>
    `.trim()

  await fs.ensureDir(path.join(root, 'build'))
  await fs.writeFile(path.join(root, 'build', 'index.html'), html)
  await fs.remove(path.join(root, '.temp'))
  spinner.stop()
}
