require('./a.js')
require('./index.css')
require('./index.less')
require('@babel/polyfill')

const img = require('./img/kl.png')
const image = new Image()
image.src = img
document.body.appendChild(image)
// import $ from 'expose-loader?exposes=$,jQuery!jquery'
// import $ from 'jquery'
// console.log($);
// const add = (a, b) => a + b

// console.log(add(1,2));

// class Monica{
//   a = 1
// }

// let mmm = new Monica()
// console.log(mmm.a);

// console.log('aaaa'.includes('a'))