const { merge } = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.js')

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      BASE_API: "'https://kuailai.net'"
    })
  ]
})