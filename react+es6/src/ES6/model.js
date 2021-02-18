
/*

  export&import 可以出现在模块的任何位置，只要处于模块的顶层就行，如果处于块级作用域内就会报错

*/
function model() {
  //  return console.log('model')
}
function models() {
  // return console.log('woshi models')
}

let a = 123;

let b = 456;

function exdef() {
  // return console.log('woshi export default')
  return console.log("export()");
}
export {
  model,
  models,
  a,
  // 可以用 as 关键字来重命名
  b as Arthas
};

// 数组去重
let arr = [1, 23, 4, 4, 123, 4, 12, 3, 123, 1, 23, 123];

let arr1 = [...new Set(arr)];
// console.log(arr1);

let arr2 = [];

for (let i of arr) {
  if (!arr2.includes(i)) {
    arr2.push(i);
  }
}
// console.log(arr2);

let arr3 = [];
for (let i of arr) {
  if (arr3.indexOf(i) === -1) {
    arr3.push(i);
  }
}
// console.log(arr3);

let arr4 = [...arr];
for (let i = 0; i < arr4.length; i++) {
  for (let j = i + 1; j < arr4.length; j++) {
    if (arr4[i] === arr4[j]) {
      arr4.splice(j, 1);
      j--;
    }
  }
}
// console.log(arr4);

let arr5a = arr.sort();
let arr5b = [];
for (let i = 0; i < arr5a.length; i++) {
  if (arr5a[i] !== arr5a[i - 1]) {
    arr5b.push(arr5a[i]);
  }
}
// console.log(arr5b);

let arr6 = [...arr];
let arr6a = arr6.filter((item, index, arr) => {
  return arr6.indexOf(item, 0) === index;
});
// console.log(arr6a);

let arr7 = [...arr];
arr7 = arr7.sort((a, b) => {
  return a - b;
});
function arr7G(i) {
  if (i < 0) return;
  if (arr7[i] === arr7[i - 1]) {
    arr7.splice(i, 1);
  }
  arr7G(i - 1);
}
arr7G(arr7.length);
// console.log(arr7);
let arr8 = [],
  maps = new Map();

for(let i of arr){
  if(maps.has(i)){
    maps.set(i, true)
  }else{
    maps.set(i, false)
    arr8.push(i)
  }
}

// console.log(arr8);
// export default 为默认导出，只能导出一个
export default exdef;
