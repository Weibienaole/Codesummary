const less = require('less')

function loader(source){
  let code = ''
  less.render(source, function(err, e){
    code = e.css
  })
  // 将 \n 替换成 \\n  因为在打包后一个 \ 为转译， 转译之后再 \n 换行才可以成功，不然转译后无法识别 n
  code = code.replace(/\n/g, '\\n');
  return code
}
module.exports = loader