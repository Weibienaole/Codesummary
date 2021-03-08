// webpack 配置文件

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
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
    // publicPath: 'weibienaole@163.com/' // 给打包后的文件都加一个前缀
  },
  // 存放所有的插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      title: 'my app',
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css' // 输出到指定文件夹
    }),
  ],
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
            limit: 1,
            outputPath: '/image/', // 输出到指定文件夹
            // publicPath: 'www.aa'
          }
        }]
      },
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
      }
    ]
  },
}
