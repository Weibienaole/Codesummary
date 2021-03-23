console.log('aaa');

// P41
// !前添加 inline-loader 为设置行内loader
// 在这些之前再添加 -! 为不执行 pre 和 nomalLoader
// 只添加 ! 为不执行 nomalLoader
// let str = require('!inline-loader!./a.js')

// console.log(str);

// P43
class Arthas{
  constructor(){
    this.name = 'i am Arthas'
  }
  getName(){
    return this.name
  }
}
let a = new Arthas
// console.log(a.getName())

import p from './pic.png'
let img = document.createElement('img')
img.src = p
document.body.appendChild(img)