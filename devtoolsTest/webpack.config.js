const path = require('path')

module.exports = {
  mode: 'development',
  entry: './index.js',
  output:{
    filename: 'bound.js',
    path: path.resolve(__dirname, 'dist')
  }
}