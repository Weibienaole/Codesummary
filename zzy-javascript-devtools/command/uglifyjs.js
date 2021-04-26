const fs = require('fs');
const UglifyJS = require('uglify-js');
const getFiles = require('./getFiles')
const noCompress = [] // 不需要压缩的文件名称

// .css 文件手动压缩
function iGetInnerText(testStr) {
  var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
  resultStr = testStr.replace(/[ ]/g, "");    //去掉空格
  resultStr = testStr.replace(/[\r\n]/g, ""); //去掉回车换行
  return resultStr;
}

// 对每个文件进行写入
function writefs(obj) {
  for (let i in obj) {
    fs.writeFile(obj[i].newPath, obj[i].code, 'utf-8', function (err) {
      if (err) throw err;
      if (i.indexOf('.js') > 0 || i.indexOf('.less') > 0) {
        // 写入完成删除源文件
        fs.unlinkSync(obj[i].form)
      }
    })
  }
}

// 拿到所有文件，并重命名、获取文件信息
function setFiles(pathTo) {
  let allFiles = getFiles(pathTo)
  let obj = {}
  allFiles.map((item, index) => {
    // 排除
    if (noCompress.indexOf(item.fileName) !== -1) return
    let newI = item.fileName.replace('.js', '.min.js')
    // 拿到文件内容
    let fileContent = fs.readFileSync(item.path, 'utf-8'), fileType = item.fileName.split('.')[1]
    obj[item.fileName] = {
      form: item.path,
      toFileName: newI,
      newPath: `${item.parentPath}/${newI}`,
      // 如果是 .js 文件，利用 UglifyJS 进行压缩，混淆，如果不是则利用正则消除空格
      code: fileType === 'js' ? UglifyJS.minify({ [item.fileName]: fileContent }).code : iGetInnerText(fileContent),
    }
  })
  return obj
}

let Uglify = function (toPath) {
  writefs(setFiles(toPath));
}

Uglify('./lib');