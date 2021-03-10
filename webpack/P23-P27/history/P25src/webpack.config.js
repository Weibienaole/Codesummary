// webpack 配置文件

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Happypack = require('happypack')
module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
    other: './src/other.js'
  },
  devServer: {
    port: 3000,
    progress: true,
    contentBase: './dist',
  },
  optimization: {
    splitChunks: { // 分割代码块
      cacheGroups: { // 缓存组
        common: { // 抽离公告模块
          chunks: 'initial', // 入口
          minSize: 10, // 如果引入的模块容量大于10字节就进行抽离
          minChunks: 2 // 如果模块的引入次数大于等于2就进行抽离
        },
        vendor: { // 抽离库
          priority: 1, // 权重 -- 代码从上到下执行，在上面的抽离已经将jquer库抽离在了上面的 文件中，会导致其他文件无法使用抽离出来的库，所以需要使用权重，设置优先级抽离
          test: /node_modules/, // 在这个文件夹内部抽离出来
          chunks: 'initial',
          minSize: 10,
          minChunks: 2
        }
      },
    }
  },
  output: {
    filename: '[name].js',
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
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-withimg-loader']
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        }],
        include: path.resolve(__dirname, 'src'), // 包含
        exclude: /node_modules/, // 排除
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ]
  },
}
