const { watch } = require('rollup')

const watcher = watch({
  input: "./src/index.js",
  output: [
    {
      dir: "dist/es",
      format: "esm",
    },
    {
      dir: "dist/cjs",
      format: "cjs",
    },
  ],
  watch: {
    exclude: ['node_modules/**'],
    include: ['src/**']
  }
})

// watch事件
watcher.on('restart', () => {
  console.log('重新构建...');
})
watcher.on('change', id => {
  console.log('模块改动id: ', id);
})
watcher.on('event', e => {
  if (e.code === 'BUNDLE_END') {
    console.log('打包信息', e);
  }
})