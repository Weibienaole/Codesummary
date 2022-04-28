


const envPlugin = {
  name: 'env',
  setup(build) {
    build.onResolve({ filter: /^env$/ }, args => {
      return ({
        path: args.path,
        namespace: 'env-ns'
      })
    })
    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
      contents: JSON.stringify(process.env),
      loader: 'json'
    }))
  }
}

async function runBuild1() {
  return await build({
    entryPoints: ['src/index.jsx'],
    bundle: true,
    outfile: 'out.js',
    // 应用插件
    plugins: [envPlugin],
  })
}


// runBuild1().catch(() => process.exit(1))
