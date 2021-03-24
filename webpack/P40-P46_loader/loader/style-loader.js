const loaderUtils = require('loader-utils')
function loader(source) {
  let str = `let style = document.createElement('style')
  style.innerHTML=${JSON.stringify(source)}
  document.head.appendChild(style)`
  return str
}
// 使用pitch之后，不再走向此loader(包括此loader)之后的loader
 // remainingRequest 剩余的请求 剩余的loader 以绝对路径的形式展示
loader.pitch = function(remainingRequest) {
  // 利用loaderUtils.stringifyRequest拿到当前路径的工作路径然后以inline-loader的形式重新处理css 最后得到的结果是css-loader处理之后的内容，然后以 innerHTML 的形式插入到页面中

  // reuqire路径 返回的就是css-loader处理好的结果  require('!!css-loader!less-loader!index.less')
  let str = `let style = document.createElement('style')
  style.innerHTML=require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)})
  document.head.appendChild(style)`
  return str
}
module.exports = loader