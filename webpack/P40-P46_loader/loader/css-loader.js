function loader(source) {
  // 校验全局有  url(内部包含特殊字符)
  let reg = /url\((.+?)\)/g
  // 定位
  let pos = 0
  let current
  // 设置初始值
  let arr = ['let list = []']
  // while循环,只要有匹配到的值,就一直循环
  while (current = reg.exec(source)) {
    // 结构 matchUrl 是包含匹配项的内容 url('./pic.png')  g是匹配到的内容 './pic.png'
    let [matchUrl, g] = current
    // 以push的形式将所有处理之后的内容包含在一个数组内,最后再以导出内部定义数组.join()的形式完成
    // 拿到匹配值的前一位
    let last = reg.lastIndex - matchUrl.length
    // push进去 不修改的内容 (url()之前的内容)
    arr.push(`list.push(${JSON.stringify(source.slice(pos, last))})`)
    // 将url里面的内容改成require引入形式
    arr.push(`list.push('url(' + require(${g}) + ')')`)
    // 完成一次循环将 pos 更新,进行下面的匹配
    pos = reg.lastIndex
  }
  // push进去匹配之后的内容
  arr.push(`list.push(${JSON.stringify(source.slice(pos))})`)
  // 以module.exports 的形式导出 内数组的join形式
  arr.push("module.exports = list.join('')")
  return arr.join('\r\n')
}
module.exports = loader