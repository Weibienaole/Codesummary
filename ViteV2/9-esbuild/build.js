const { build, buildSync, context } = require('esbuild')
/*
async function runBuild() {
  const result = await build({
    entryPoints: ['./src/index.jsx'],
    absWorkingDir: process.cwd(),
    outdir: 'dist',
    minify: false,
    splitting: true,
    bundle: true,
    write: true,
    format: 'esm',
    sourcemap: true,
    metafile: true,
    loader: {
      '.png': 'base64'
    }
  })
  // console.log(result);
  const server = await context({
    entryPoints: ['./src/index.jsx'],
    absWorkingDir: process.cwd(),
    outdir: 'dist',
    minify: false,
    splitting: true,
    bundle: true,
    write: true,
    format: 'esm',
    sourcemap: true,
    metafile: true,
    loader: {
      '.png': 'base64'
    }
  })
  server.serve({
    servedir: './dist',
    port: 7001,
    host: '127.0.0.1'
  }).then((res) => {
    console.log(res);
  })
}
runBuild()
*/

const httpDownload = require('./plugin/httpDownload')
const html = require('./plugin/html')

async function runBuild(){
  await build({
    absWorkingDir: process.cwd(),
    entryPoints: ["./src/index2.jsx"],
    outdir: "dist/index2",
    bundle: true,
    format: "esm",
    splitting: true,
    sourcemap: true,
    metafile: true,
    plugins: [httpDownload(), html()],
  })
}
runBuild()