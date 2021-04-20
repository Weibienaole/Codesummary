let fs = require('fs');
module.exports = function getFiles(path) {
  let files = []
  getAllFiles(path)
  // 递归拿到所有文件，并重命名、获取文件信息
  function getAllFiles(path) {
    // 读取当前文件夹
    let nowLevelFiles = fs.readdirSync(path)
    nowLevelFiles.forEach(i => {
      // 判断是否是文件夹
      if (!fs.lstatSync(`${path}/${i}`).isDirectory()) {
        files.push({fileName: i, path: `${path}/${i}`, parentPath: path})
      } else getAllFiles(`${path}/${i}`, {})
    })
  }
  return files
}