const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: './index.ts',
  output: {
    filename: 'boundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer:{
    port: 8001,
    open: true,
    progress: true
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader'
    }]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      hash: true
    }),
  ],
  resolve:{
    extensions: ['.ts', '.js']
  }
}