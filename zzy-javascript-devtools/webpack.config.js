const path = require('path')
module.exports = {
  mode: 'development', // production development
  entry: './index.js',
  output:{
    filename: 'boundle.js',
    path: path.resolve(__dirname, './lib')
  }
}