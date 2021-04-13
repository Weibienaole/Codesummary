let fs = require('fs');
let UglifyJS = require('uglify-js');

// .css 文件手动压缩
function iGetInnerText(testStr) {
  var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
  resultStr = testStr.replace(/[ ]/g, "");    //去掉空格
  resultStr = testStr.replace(/[\r\n]/g, ""); //去掉回车换行
  return resultStr;
}

// 递归对每个文件进行写入
function writefs(obj, toPath, pPath = toPath) {
  for (let i in obj) {
    if (!fs.lstatSync(`${pPath + '/'}${i}`).isDirectory()) {
      let tPath = pPath.replace(toPath, toPath)
      fs.writeFile(`${tPath}/${obj[i].toFileName}`, obj[i].code, 'utf-8', function (err) {
        if (err) throw err;
        console.log('success');
        if (i.indexOf('.js') > 0 || i.indexOf('.less') > 0) {
          // 写入完成删除源文件
          fs.unlinkSync(`${tPath}/${i}`)
        }
      })
    } else writefs(obj[i], toPath, `${pPath + '/'}${i}`)
  }
}

// 递归拿到所有文件，并重命名、获取文件信息
function getAllFiles(pathTo, obj = {}) {
  // 读取当前文件夹
  let nowLevelFiles = fs.readdirSync(pathTo)
  nowLevelFiles.forEach(i => {
    // 判断是否是文件夹
    if (!fs.lstatSync(`${pathTo}/${i}`).isDirectory()) {
      let newI = i.replace('.js', '.min.js')
      // 拿到文件内容
      let fileContent = fs.readFileSync(`${pathTo}/${i}`, 'utf-8'), fileType = i.split('.')[1]
      obj[i] = {
        form: `${pathTo}/${i}`,
        toFileName: newI,
        // 如果是 .js 文件，利用 UglifyJS 进行压缩，混淆，如果不是则利用正则消除空格
        code: fileType === 'js' ? UglifyJS.minify({ [i]: fileContent }).code : iGetInnerText(fileContent),
      }
    } else obj[i] = getAllFiles(`${pathTo}/${i}`, {})
  })
  return obj
}

let Uglify = function (toPath) {
  writefs(getAllFiles(toPath), toPath);
}

Uglify('./lib');