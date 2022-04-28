const { rollup, watch } = require('rollup')

const inputOptions = {
  input: './src/index.js',
  external: [],
  plugins: []
}

const outputOptions = [
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
]

async function build() {
  let buildFiled = false
  let bundle
  try {
    const bundle = await rollup(inputOptions)
    for (const outputOption of outputOptions) {
      const { output } = await bundle.generate(outputOption)
      await bundle.write(outputOption)
    }
  } catch (e) {
    buildFiled = true
    console.error(e)
  }
  if(bundle){
    await bundle.close()
  }
  process.exit(buildFiled ? 1 : 0)
}

build()