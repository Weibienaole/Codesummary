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
      // loader 的执行顺序一般是从左到右，从下到上
      /*
      有四种执行顺序
      pre 最前 ->
      nomal 普通loader ->
      inline-loader 行内loader ->
        具体看a.js
      post 最后
      */ 

      {
        test: /\.js$/,
        // 写法一 直接找到绝对路径
        // use: [path.resolve(__dirname, 'loader', 'loader1')]
        use: ['loader1'],
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        // 写法一 直接找到绝对路径
        // use: [path.resolve(__dirname, 'loader', 'loader1')]
        use: ['loader2']
      },
      {
        test: /\.js$/,
        // 写法一 直接找到绝对路径
        // use: [path.resolve(__dirname, 'loader', 'loader1')]
        use: ['loader3'],
        enforce: 'post'
      }
    ]
  }
}