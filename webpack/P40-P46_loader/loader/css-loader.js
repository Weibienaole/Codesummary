function loader(source){
  let reg = /url\((.+?)\)/g
  let pos = 0
  let current = []
  let arr = ['let list = []']
  while(current = reg.exec(source)){
    let [matchUrl, g] = current
    arr.push(`list.push(${JSON.stringify(source.slice(pos, reg.lastIndex - matchUrl.length))})`)
    arr.push(`list.push('url(' + require(${g}) + ')')`)
    pos = reg.lastIndex
  }
  arr.push(`list.push(${JSON.stringify(source.slice(pos))})`)
  arr.push("module.exports = list.join('')")
  return arr.join('\r\n')
}
module.exports = loader