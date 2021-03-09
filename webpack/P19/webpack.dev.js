const { merge } = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.js')

module.exports = merge(baseConfig, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      BASE_API: "'http://localhost:3000'"
    })
  ]
})