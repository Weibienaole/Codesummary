import * as rollup from 'rollup'

// 常用 inputOptions 配置
const inputOptions = {
  input: './src/index.js',
  external: [],
  plugins: []
}

const outputOptionsList = [
  // 常用 outputOptions 配置
  {
    dir: 'dist/es',
    entryFileNames: `[name].[hash].js`,
    chunkFileNames: 'chunk-[hash].js',
    assetFileNames: 'assets/[name]-[hash][extname]',
    format: 'es',
    sourcemap: true,
    globals: {
      lodash: '_'
    }
  }
  // 省略其它的输出配置
]

async function runBuild() {
  let boundle,
    buildFailed = false
  try {
    boundle = await rollup.rollup(inputOptions)
    for (const outputOptions of outputOptionsList) {
      const { output } = await boundle.generate(outputOptions)
      await boundle.write(outputOptions)
    }
  } catch (error) {
    buildFailed = true
    console.error(error)
  }
  if (boundle) {
    await boundle.close()
  }
  process.exit(buildFailed ? 1 : 0)
}

runBuild()
