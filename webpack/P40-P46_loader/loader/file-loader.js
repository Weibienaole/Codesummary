const loaderUtils = require("loader-utils");
function loader(source) {
  // 根据当前的格式形成一个文件的路径
  let filename = loaderUtils.interpolateName(this, '[hash].[ext]', {content: source})
  // 发射文件
  this.emitFile(filename, source)
  // 导出文件名称,在require的时候是以 module.exports 导入的
  return `module.exports = '${filename}'`;
}
// 切换为二进制源码
loader.raw = true
module.exports = loader;
