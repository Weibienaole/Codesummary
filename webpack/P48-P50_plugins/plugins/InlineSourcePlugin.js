const HtmlWebpackPlugin = require('html-webpack-plugin');

class InlineSourcePlugin {
  constructor({ test }) {
    this.match = test // 配置文件中设置的 正则
  }
  // 单个处理每一个标签
  processTag(tag, compilation) {
    let newTag, url
    // 名称为 link 且 正则校验通过
    if (tag.tagName == 'link' && this.match.test(tag.attributes.href)) {
      newTag = {
        // 修改为新的内容
        tagName: 'style',
        attributes: {
          type: 'text/css'
        }
      }
      // 保存引入地址
      url = tag.attributes.href
    }
    // 同上
    if (tag.tagName == 'script' && this.match.test(tag.attributes.src)) {
      newTag = {
        tagName: 'script',
        attributes: {
          type: 'application/javascript'
        }
      }
      url = tag.attributes.src
    }
    // 如果 url 有值，则 return 新的 newTag
    if (url) {
      // 将静态内容中匹配到的源码传入 newTag
      newTag.innerHTML = compilation.assets[url].source()
      // 删除资源中的文件，防止打包生成
      delete compilation.assets[url]
      return newTag
    }
    // 如果没值，说明校验失败，正常传出
    return tag
  }
  // 整体进行处理
  processTags(data, compilation) {
    // 标签分为 headTags 和 bodyTags 所以分开处理
    let headTags = []
    let bodyTags = []
    // 遍历处理，防止有多个需要转化的标签
    data.headTags.forEach(tag => {
      headTags.push(this.processTag(tag, compilation))
    })
    data.bodyTags.forEach(tag => {
      bodyTags.push(this.processTag(tag, compilation))
    })
    // 最后利用 扩展 + 结构 替换原有内容
    return { ...data, headTags, bodyTags }
  }
  apply(compiler) {
    // 整体的处理是基于 HtmlWebpackPlugin 插件进行的
    // 先拿到compiler的 compilation 当前资源
    // 再根据 HtmlWebpackPlugin 插件的 getHooks 根据当前声明周期新建出 HtmlWebpackPlugin插件独有的 生命周期
    // alterAssetTagGroups 为 修改资源标签组 适合修改多个资源的标签
    // 异步拿到信息
    compiler.hooks.compilation.tap('InlineSourcePlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('InlineSourcePlugin',
        // https://www.npmjs.com/package/html-webpack-plugin -> alterAssetTagGroups hook
        (data, cb) => {
          data = this.processTags(data, compilation)
          cb(null, data)
        }
      )
    })
  }
}
module.exports = InlineSourcePlugin