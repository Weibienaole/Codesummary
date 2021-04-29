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
              ['@babel/preset-env',
                {
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
  resolve: {
    extensions: ['.ts', '.js']
  }
}