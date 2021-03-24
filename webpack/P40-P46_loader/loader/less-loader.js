const less = require('less')

function loader(source){
  let css
  less.render(source, (err, c) => {
    css = c.css
  })
  return css
}
module.exports = loader