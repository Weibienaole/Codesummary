const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: './index.ts',
  output: {
    filename: 'boundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 8001,
    open: true,
    progress: true
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              // 添加预设
              ['@babel/preset-env',
                {
                  // 设定为按需加载
                  useBuiltIns: 'usage',
                  corejs: {
                    version: 3 // 设置版本
                  },
                  // 设置兼容浏览器版本
                  targets: {
                    chrome: '60',
                    firefox: '60',
                    ie: '10',
                    safari: '10',
                    edge: '17'
                  }
                }]
            ]
          }
        },
        'ts-loader'
      ]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      hash: true
    }),
  ],
  // 引入文件的时候，默认引入.js文件，所以可以不用写后缀，但是如果引入 .ts 不写后缀的话需要在此设置
  resolve: {
    extensions: ['.ts', '.js']
  }
}