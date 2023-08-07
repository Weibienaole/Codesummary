import { InlineConfig, build as viteBuild } from 'vite'
import reactPlugin from '@vitejs/plugin-react'
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants'

export async function build(root = process.cwd()) {
  // 分别打包client和server代码
  boundle(root)
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
            output: isServe ? {
              format: 'cjs',
              entryFileNames: '[name].js'
            } : {
              format: 'esm',
              entryFileNames: '[name].js'
            }
          }
        }
      }
    }

    console.log(`Building client + server bundles...`)
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
    return [clientBoundle, serverBoundle]
  } catch (e) {
    console.log('err', e)
  }
}
