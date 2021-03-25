class FileListPlugin{
  constructor({filename}){
    // 传入要发射的文件名称
    this.filename = filename
  }
  apply(compiler){
    // 发射时进行处理
    compiler.hooks.emit.tap('FileListPlugin', stats => {
      // 拿到当前需要打包的文件目录以及详细信息[{filename, datas}]
      let assets = stats.assets
      // 设定初始模版
      let content = '###  文件名称    大小\r\n'
      // 利用Object.entries将数组对象改造成二维数组，进行forEach循环，结构拿到内部参数
      Object.entries(assets).forEach(([filename, obj])=>{
        // 将每一个记录的文件都加入到内容中
        content += `-    ${filename}    ${obj.size()}\r\n`
      })
      // 在目录中新增一个打包项，并设置它的值
      assets[this.filename] = {
        source(){
          return content
        },
        size(){
          return content.length
        }
      }
    })
  }
}
module.exports = FileListPlugin