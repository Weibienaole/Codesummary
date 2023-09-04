import { InlineConfig, build as viteBuild } from 'vite'
import { RollupOutput } from 'rollup'
import { pathToFileURL } from 'url'
import * as path from 'path'
import fs from 'fs-extra'

import {
  CLIENT_ENTRY_PATH,
  EXTERNALS,
  MASK_SPLITTER,
  PACKAGE_ROOT,
  SERVER_ENTRY_PATH
} from './constants'
import { SiteConfig } from 'shared/types'
import { createVitePlugins } from './vitePlugins'
import { Route } from './plugin-routes'
import { RenderResult } from '../runtime/ssr-entry'

const dynamicImport = new Function('m', 'return import(m)')

const CLIENT_OUTPUT = 'build'

export async function boundle(root: string, config: SiteConfig) {
  try {
    const resolveViteBuildConfig = async (
      isServe: boolean
    ): Promise<InlineConfig> => {
      return {
        mode: 'production',
        root,
        plugins: await createVitePlugins(config, undefined, isServe),
        ssr: {
          noExternal: ['react-router-dom', 'lodash-es']
        },
        build: {
          minify: false,
          // assetsDir: '',
          ssr: isServe,
          outDir: isServe
            ? path.join(root, '.temp')
            : path.join(root, CLIENT_OUTPUT),
          rollupOptions: {
            input: isServe ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output:
              // isServe
              //   ? {
              //       format: 'cjs',
              //       entryFileNames: '[name].js'
              //     }
              //   : {
              //       format: 'esm',
              //       entryFileNames: '[name].js'
              //     }
              {
                format: isServe ? 'cjs' : 'esm'
              },
            external: EXTERNALS
          }
        }
      }
    }

    console.log('Building client + server bundles...')
    const [clientBoundle, serverBoundle] = await Promise.all([
      viteBuild(await resolveViteBuildConfig(false)),
      viteBuild(await resolveViteBuildConfig(true))
    ])

    const publicDir = path.join(root, 'public')
    if (fs.pathExistsSync(publicDir)) {
      await fs.copy(publicDir, path.join(root, CLIENT_OUTPUT))
    }

    await fs.copy(
      path.join(PACKAGE_ROOT, 'vendors'),
      path.join(root, CLIENT_OUTPUT)
    )
    return [clientBoundle, serverBoundle] as [RollupOutput, RollupOutput]
  } catch (e) {
    console.log('err', e)
  }
}

const buildZislands = async (
  root: string,
  zislandPathToMap: Record<string, string>
) => {
  const zislandsInjectCode = `
  ${Object.entries(zislandPathToMap)
    .map(
      ([islandName, islandPath]) =>
        `import { ${islandName} } from '${islandPath}'`
    )
    .join('')}
window.ZISLANDS = { ${Object.keys(zislandPathToMap).join(', ')} };
window.ZISLAND_PROPS = JSON.parse(
document.getElementById('zisland-props').textContent
);
`
  const injectId = 'zisland:inject'
  return viteBuild({
    mode: 'production',
    esbuild: {
      jsx: 'automatic'
    },
    build: {
      outDir: path.join(root, '.temp'),
      rollupOptions: {
        input: injectId,
        external: EXTERNALS
      }
    },
    plugins: [
      {
        name: 'zisland:inject',
        enforce: 'post',
        resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER)
            return this.resolve(originId, importer, { skipSelf: true })
          }
          if (id === injectId) {
            return id
          }
        },
        load(id) {
          if (id === injectId) {
            return zislandsInjectCode
          }
        },
        // 独立的模块只需要js，静态文件可以进行删除
        generateBundle(_, boundle) {
          for (const name in boundle) {
            if (boundle[name].type === 'asset') {
              delete boundle[name]
            }
          }
        }
      }
    ]
  })
}

async function renderPage(
  render: (url: string) => RenderResult,
  root: string,
  boundle: RollupOutput,
  routes: Route[]
) {
  const clientChunk = boundle.output.find(
    (chunk) => chunk.isEntry && chunk.type === 'chunk'
  )
  // console.log('renderPage', clientChunk)
  const { default: ora } = await dynamicImport('ora')
  const spinner = ora()
  spinner.start('Rendering page in server side...')
  await Promise.all(
    routes.map(async (route) => {
      const routePath = route.path
      const {
        appHtml,
        zislandToPathMap,
        zislandProps = {}
      } = await render(routePath)
      const zislandAssets = boundle.output.filter(
        (item) => item.type === 'asset' && item.fileName.endsWith('.css')
      )

      const zislandBundle = await buildZislands(root, zislandToPathMap)

      const zislandCode = (zislandBundle as RollupOutput).output[0].code

      const normalizeVendorFilename = (name: string) =>
        name.replace(/\//g, '_') + '.js'
      const html = `
    <!DOCTYPE html>
    <html>
      <head> 
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>title</title>
        <meta name="description" content="xxx">
        ${zislandAssets
          .map(
            (assets) => `<link rel="stylesheet" href="/${assets.fileName}" >`
          )
          .join('\n')}
        <script type="importmap">
          {
            "imports": {
              ${EXTERNALS.map(
                (item) => `"${item}": "/${normalizeVendorFilename(item)}"`
              ).join(', ')}
            }
          }
        </script>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        </body>
        <script type="module">${zislandCode}</script>
        <script type="module" src="/${clientChunk?.fileName}"></script>
        <script id="zisland-props">${JSON.stringify(zislandProps)}</script>
        </html>
        `.trim()
      const fileName = routePath.endsWith('/')
        ? `${routePath}index.html`
        : `${routePath}.html`
      await fs.ensureDir(path.join(root, CLIENT_OUTPUT, path.dirname(fileName)))
      await fs.writeFile(path.join(root, CLIENT_OUTPUT, fileName), html)
    })
  )
  // await fs.remove(path.join(root, '.temp'))

  spinner.stop()
}

export async function build(root = process.cwd(), config: SiteConfig) {
  // 分别打包client和server代码

  const [clientBoundle] = await boundle(root, config)

  // 引入SSR模块
  root = path.resolve(root)
  const serverEnterPath = path.join(root, '.temp', 'ssr-entry.js')
  // 服务端渲染，产出
  const { render, routes } = await import(
    pathToFileURL(serverEnterPath).toString()
  )
  await renderPage(render, root, clientBoundle, routes)
}
