const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index',
  output: {
    filename: 'boundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 8081,
    open: true,
    progress: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: {
                  version: 3
                },
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
        }, 'ts-loader']
      },
      {
        test: /.less$/,
        use:[
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      hash: true
    })
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
}