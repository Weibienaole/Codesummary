// webpack 配置文件

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devServer: {
    port: 8080,
    progress: true,
    contentBase: './dist',
    proxy: {
      // 1.  在内部生成接口,这样就不用担心跨域了
      // before(app) {
      //   app.get('/user', function(rep, res){
      //     console.log(rep);
      //     res.json({ name: 'Monica-before' })
      //   })
      // },
      // 2. 重写，将请求代理到express服务器上
      // '/api': {
      //   target: 'http://localhost:3500/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': '/'
      //   }
      // }
      // 3.  单个接口
      // '/api': 'http://localhost:3500'
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // 解析第三方包
  resolve:{
    modules:[path.resolve('node_modules')], // 限定在指定文件中查找
    // alias: { // 别名
    //   bootstrap: 'bootstrap/dist/css/bootstrap.css'
    // },
    mainFields:['style', 'main'], // 在node_modules内插件的package.json中默认运行js，用用此属性可以设置运行优先级。没有style(css)再执行main(js)
    // extensions: ['css', 'js', 'vue'], // 如果文件没有尾缀的时候，优先以什么文件类型查找，优先级从左到右
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      title: 'my app',
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
    new webpack.DefinePlugin({
      BASE_API: JSON.stringify('dev')
    })
    // new CleanWebpackPlugin(), // 每次打包的时候都会清除之前的dist目录
    // new CopyWebpackPlugin([{ from: 'txt', to: './txt' }]),
    // new webpack.BannerPlugin('Create by zzy,thanks')
  ],
  // watch: true, // 打包后开启监听，每更改代码时更新打包内容
  // watchOptions: {
  //   poll: 1000, // 每1000ms询问一次文件是否最新
  //   aggregateTimeout: 500,// 防抖
  //   ignored: /node_modules/ // 不需要监控那些文件
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
          options: {
            limit: 1,
            outputPath: '/image/',
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
