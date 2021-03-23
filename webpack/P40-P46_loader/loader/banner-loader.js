const loaderUtils = require('loader-utils')
// 校验参数类型，如果有问题便报错
const { validate } = require('schema-utils')
const fs = require('fs')
function loader(source) {
  // 获取异步回调
  const cb = this.async()
  // 获取当前 loader 设置
  const options = loaderUtils.getOptions(this)
  // 设置校验格式
  let schema = {
    type: 'object',
    properties: {
      filename: {
        type: 'string'
      },
      text: {
        type: 'string'
      }
    }
  }
  // 进行校验(校验文件, loader设置, 报错之后显示的loader)
  validate(schema, options, 'banner-loader')
  if (options.filename) {
    // 如果存在 filename 参数，利用fs读取文件内容，通过异步回调拿到err与data
    fs.readFile(options.filename, 'utf8', function (err, data) {
      // cb返回内容
      cb(err, `/**${data}**/${source}`)
    })
  } else {
    // 同上
    cb('err code', `/**${options.text}**/${source}`)
  }
}
module.exports = loader