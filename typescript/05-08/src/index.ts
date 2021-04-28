let a = 'aaa'

let b

// 8
// 当设置 noImplicitAny 为 true 时  以下会报错，因为参数 a, b 为隐式 any
// function as(a, b){

// }

function as(this: Window, a: number, b: number){
  // console.log(this); // 因为this无法确定是什么，设置了 noImplicitThis 之后报错
  console.log(this);
  
}
let dom = document.querySelector('.s')
// 使用 ?. 判空 或者 if  三元 && 都可 (strictNullChecks 为 true)
dom?.addEventListener('click', function(){
  console.log('aaa');
})