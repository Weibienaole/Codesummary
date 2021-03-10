// webpack 配置文件

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Happypack = require('happypack')
module.exports = {
  mode: 'production',
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
  plugins: [
    new HtmlWebpackPlugin({
      // template: './src/index.html',
      filename: 'index.html',
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
    // 启动多线程进行打包，在大项目中效果明显
    new Happypack({
      id: 'js',
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      }]
    })
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
          options: {
            limit: 1,
            outputPath: '/image/', // 输出到指定文件夹
            // publicPath: 'www.aa'
          }
        }]
      },
      {
        test: /\.js$/,
        use: 'happypack/loader?id=js', // 有可能会是css也进行多线程，所以需要设置id
        include: path.resolve(__dirname, 'src'), // 包含
        exclude: /node_modules/, // 排除
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      }
    ]
  },
}
