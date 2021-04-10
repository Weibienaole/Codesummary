var UglifyJS = require('uglify-js');
var fs = require('fs');

var JS = ['devTools', 'JSBriged', 'regModule', 'reactComponents/index'];
//只需要写名字  自动将./js 加在每一个前面 并添加.JS后缀
var AddJS = function (JS) {
  var newJS = [];
  JS.map(function (x) {
    x = './babelCode/' + x + '.js';
    newJS.push(x);
  })
  return newJS;
}
var JSOptions = AddJS(JS);
//压缩的选项
//写文件封装函数
function writefs(path, code) {
  fs.writeFile(path, code, 'utf-8', function (err) {
    if (err) throw err;
    console.log('success');
  })
}

var Uglify = function (options) {
  options = options || {};
  options.type = (options.type || 'sign').toLowerCase();
  options.outName = (options.outName || './lib/out.min.js');
  var data = options.data;

  if (options.type == 'sign') {
    for (var i in data) {
      var minI = data[i].replace('.js', '') + '.min.js'
      minI = minI.replace('/babelCode', '/lib')
      var result = UglifyJS.minify({[minI]: fs.readFileSync(options.data[i], 'utf-8')});
      writefs(minI, result.code);
    }
  } else {
    var result = UglifyJS.minify(data);
    writefs(options.outName, result.code);
  }
}

Uglify({
  data: JSOptions,
  type: 'sign', //利用状态 sign标志为单独压缩 其余为合并压缩
  outName: './js/out.min.js'
});