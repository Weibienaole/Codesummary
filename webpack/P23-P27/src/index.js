// const button = document.createElement('button')
// button.innerHTML = 'Arthas'
// button.addEventListener('click', ()=>{
//   console.log('Woooooo');
//   import('./other.js') // ES6 提案 动态加载，只有执行到这行的时候才回去引入此模块
// })
// document.body.appendChild(button)
// console.log('index', '+++++++-------')

import './other.js'
// P27
console.log(1234);
// 判断是否启用热更新，监听某个文件是否已更新
if(module.hot){
  module.hot.accept('./other.js', () =>{
    console.log('更新');
  })
}