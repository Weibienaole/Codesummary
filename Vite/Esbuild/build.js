const { build, buildSync, serve } = require('esbuild')

async function runBuild() {
  // 同步返回一个结果
  const result = await build({
    // 根目录
    absWorkingDir: process.cwd(),
    // 入口文件 接受一个数组
    entryPoints: ['./src/index.jsx'],
    // 输出目标
    outdir: 'dist',
    // 是否打包
    bundle: true,
    // 模块格式
    format: 'esm',
    // 需要排除的依赖项
    external: [],
    // 是否开启自动拆包
    splitting: true,
    // 是否生成sourcemap文件
    sourcemap: true,
    // 是否生成源文件
    metafile: true,
    // 是否压缩文件
    minify: false,
    // 是否开始监听，开启之后任何改动都会重新打包
    watch: false,
    // 是否将产物写入磁盘
    write: true,
    // Esbuild 内置了一系列的 loader，包括 base64、binary、css、dataurl、file、js(x)、ts(x)、text、json
    // 针对一些特殊的文件，调用不同的 loader 进行加载
    loader: {
      '.png': 'base64'
    }
  })
  console.log(result)
  return result
}

// runBuild()

function runBuild2() {
  serve(
    {
      port: 9090,
      servedir: './dist'
    },
    {
      absWorkingDir: process.cwd(),
      entryPoints: ["./src/index.jsx"],
      bundle: true,
      format: "esm",
      splitting: true,
      sourcemap: true,
      ignoreAnnotations: true,
      metafile: true,
    }
  ).then(server => {
    console.log("HTTP Server starts at port", server.port);
  })
}

// runBuild2()
