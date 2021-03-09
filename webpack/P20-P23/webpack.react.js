const path = require('path')
const webpack = require('webpack')
module.exports = {
  mode: 'production',
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    filename: '_Dll_[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: '_Dll_[name]', // 将打包后的js文件中的函数返回的内容赋值在设定好的变量中
    libraryTarget: 'var', // 设置模式 var -> 默认 commonjs -> node方式 还有其余不再赘述
  },
  plugins: [
    // 利用此插件将打包后的recatJS插入到正式文件中
    new webpack.DllPlugin({
      name:'_Dll_[name]',
      path: path.resolve(__dirname, 'dist', 'manifest.json') 
    })
  ]
}