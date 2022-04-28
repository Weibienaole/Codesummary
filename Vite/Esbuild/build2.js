const { build, buildSync, serve } = require('esbuild')
const httpImport = require('./httpImportPlugin')
const html = require('./htmlPlugin')

async function runBuild() {
  await build({
    absWorkingDir: process.cwd(),
    entryPoints: ['./src/index.jsx'],
    outdir: 'dist',
    bundle: true,
    format: 'esm',
    splitting: true,
    sourcemap: true,
    metafile: true,
    plugins: [httpImport(), html()],
  }).then(() => {
    console.log("🚀 Build Finished!");
  }).catch(() => console.log('error'))
}

runBuild()
