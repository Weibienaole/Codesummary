// webpack 配置文件

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development', // 模式 生产： production  开发： development
  entry: './src/index.js', // 入口
  devServer: {
    port: 3000,
    progress: true,
    contentBase: './dist',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // 存放所有的插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseInlineTagWhitespace: true
      },
      hash: true
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  }
}

// 19000
// +17196

// 36196
// -5800

// 30396

// const now = 30000

// 30000 - 5800 * 4
// 6800

// 6800
// +2000

// 9800

// // 中 均  租+押 正常
// c = 2100 * 4
// 8400
// 10333
// 9600
// 733

// b = 1700 * 4
// 6800
// 8733
// 9600
// -867

// a = 2000 * 4
// 8000
// 9933
// 7600
// 2333

// +1933

