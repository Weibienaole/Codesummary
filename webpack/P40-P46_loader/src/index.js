console.log('aaa');

// !前添加 inline-loader 为设置行内loader
// 在这些之前再添加 -! 为不执行 pre 和 nomalLoader
// 只添加 ! 为不执行 nomalLoader
let str = require('!inline-loader!./a.js')

console.log(str);