const path = require('path')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'boundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolveLoader: {
    // 写法二，设置别名(alias)
    // alias: {
    //   loader1: path.resolve(__dirname, 'loader', 'loader1')
    // }
    // 写法三 设置查找文件 插件一般都在 node_modules 中查找，设置第二个查找文件，就可以和值对应上
    modules:['node_module', 'loader']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // 写法一 直接找到绝对路径
        // use: [path.resolve(__dirname, 'loader', 'loader1')]
        use: ['loader1']
      }
    ]
  }
}