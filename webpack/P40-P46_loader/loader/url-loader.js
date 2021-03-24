const loaderUtils = require('loader-utils')
const mime = require('mime')

function loader(source) {
  // 拿到设置中的limit
  let { limit } = loaderUtils.getOptions(this)
  // 判断 如果大于既定数量则使用base64编码
  if (limit && limit > source.length) {
    // mime.getType拿到文件路径下的后缀
    // return内容和file-loader同理
    return `module.exports="data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
  } else {
    // 反之引入file-laoder进行处理
    return require('./file-loader').call(this, source)
  }
}
loader.raw = true
module.exports = loader