const { devtools, regModules } = require('zzy-javascript-devtools')
const comments1 = [
  { id: 1, parentId: null },
  { id: 2, parentId: 1 },
  { id: 3, parentId: 1 },
  { id: 4, parentId: 2 },
  { id: 5, parentId: 4 }
];
// console.log(devtools.formatNowTime(1616748659996))

function typeOf(data) {
  let res = Object.prototype.toString.call(data).split(' ')[1]
  return res.slice(0, res.length - 1)
}
// console.log(typeOf(undefined), typeof null)

// let arr = [1, 2, 3, 1, 2, 3, 1, 2, 4]

// // new Set
// console.log([...new Set(arr)], 'set');

// // new Set + from
// console.log(Array.from(new Set(arr)), 'set + from');

// // filter + indexOf

// console.log(arr.filter((item, index, array) => array.indexOf(item) === index), 'filter + indexOf'); 

function flatFn(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}
// console.log(flatFn([1, [2, [3, [4]]]]), 'fn');


// 浅拷贝 只具有对象
function copy1(data) {
  if (typeof data !== 'object') return
  let a = data instanceof Array ? [] : {}
  for (let i in data) {
    a[i] = data[i]
  }
  return a
}


// 调用例子
devtools.lazyImage()


