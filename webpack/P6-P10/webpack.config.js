// webpack 配置文件

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyjsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    port: 3000,
    progress: true,
    contentBase: './dist',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // 存放所有的插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      title: 'my app',
      // minify: {
      //   removeAttributeQuotes: true,
      //   collapseInlineTagWhitespace: true
      // },
      hash: true
    }),
    // index.html 抽离 css
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    // new webpack.ProvidePlugin({ // 每个模块中都注入jquery
    //   $: 'jquery'
    // })
  ],
  // externals:{
  //   jquery: '$'
  // },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-withimg-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [{
          loader: 'url-loader',
          options:{
            limit: 200 * 1024
          }
        }]
      },
      // {
      //   test: require.resolve('jquery'),
      //   loader: 'expose-loader',
      //   options: {
      //     exposes: ['$', 'jQuery']
      //   }
      // },
      // {
      //   test: /\.js$/,
      //   use:[{
      //     loader: 'eslint-loader',
      //     options:{
      //       enforce: 'pre'
      //     }
      //   }]
      // },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime']
          },
        }],
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        // MiniCssExtractPlugin.loader 抽离当前文件
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],

      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
      }
    ]
  },
  // 优化项
  optimization: {
    minimizer: [new OptimizeCssPlugin(), new UglifyjsPlugin({
      cache: true, // 使用缓存
      parallel: true, // 并行打包
      sourceMap: true // 源码映射
    })]
  }
}
