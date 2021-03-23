// 引入 @babel/core 核心插件
const babel = require('@babel/core')
const loaderUtils = require('loader-utils')
function loader(source){
  // 可以通过 loader-utils 插件的 getOptions 方法拿到当前loader在配置中的设置(options)，也就是上文的预设
  let options = loaderUtils.getOptions(this)
  // 这里的 this 是 loader 的 contentText 也就是上下文，自己带有很多方法。 this.async是可以实现异步返回内容
  let cb = this.async()
  // 由于要通过babel核心模块进行改动代码，所以是异步操作
  babel.transform(source,{
    ...options,
    // 开启mource-map(需要配置中同步开启)
    sourceMap: true,
    // this.resourcePath是拿到入口文件的绝对路径，取最后一段当作文件名称
    filename: this.resourcePath.split('/').pop()
  },function(err, result){
    // 回调通过异步方法返回 错误, 结果.代码, source-map
    cb(err, result.code, result.map)
  })
}
module.exports = loader