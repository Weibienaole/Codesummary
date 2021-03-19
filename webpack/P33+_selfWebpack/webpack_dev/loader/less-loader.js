const less = require('less')

function loader(source){
  let code = ''
  less.render(source, function(err, e){
    code = e.css
  })
  code = code.replace(/\n/g, '\\n');
  return code
}
module.exports = loader