const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry:{
    home: './home.js',
    other: './other.js'
  },
  output:{
    filename: '[name].js',
    path: path.resolve(__dirname, './dist')
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'other.html',
      chunks: ['other']
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'home.html',
      chunks: ['home']
    })
  ]
}