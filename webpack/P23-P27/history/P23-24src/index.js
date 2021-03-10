
// console.log('a'); // P23

// P24
// tree shake
import cele from './test.js'
console.log(cele.sum(1,2), '----------');

let cele2 = require('./test')
console.log(cele2.default.sum(1,2));

let a = 1,b=2,c=3
let d = a + b + c
console.log(d, '++++++++++');
