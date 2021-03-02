let str = require('./a.js')
console.log(str);
require('./index.css')
require('./index.less')
const add = (a, b) => a + b

console.log(add(1,2));

class Monica{
  a = 1
}

let mmm = new Monica()
console.log(mmm.a);