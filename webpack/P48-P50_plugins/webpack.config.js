const path = require('path')
const SyncPlugin = require('./plugins/SyncPlugin')
const AsyncPlugin = require('./plugins/AsyncPlugin')
const FileListPlugin = require('./plugins/FileListPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineSourcePlugin = require('./plugins/InlineSourcePlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output:{
    filename: 'bound.js',
    path: path.resolve(__dirname, 'dist')
  },
  module:{
    rules:[
      {
        test: /\.css$/,
        use:[MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins:[
    // P48
    // new SyncPlugin(),
    // new AsyncPlugin(),
    // P49
    new HtmlWebpackPlugin({
      filename: 'index.html'
    }),
    new FileListPlugin({
      filename: 'list.md'
    }),
    // P50
    new InlineSourcePlugin({
      test: /(\.js|css)/
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
  ]
}