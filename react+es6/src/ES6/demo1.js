import React, { useState, useEffect, useContext } from "react";

function Box() {
  return (
    <div>
      <h2>Array\Object</h2>
      <ArrayFrom></ArrayFrom>
      <ArrayBox></ArrayBox>
      <ObjBox></ObjBox>
      <ObjectMethods></ObjectMethods>
    </div>
  );
}
/**
 *
 *
 * Array
 *
 *
 *
 *
 */
function ArrayFrom() {
  // Array.from() 转换真正的数组
  let set = new Set(["a", "b", "w"]);
  // 如果Array.from内是一个数组则返回一个全新的数组
  let a = [1, 2, 3];
  let b = Array.from(a);
  b[1] = 4;
  // a, b; // [1, 2, 3] , [1, 4, 3]

  // 任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。

  Array.from({ length: 3 }); // [undefined, undefined, undefined]

  // Array.from 接受第二个参数，类似map
  Array.from([1, 2, 3], x => x * x); // [1,4,9]
  Array.from([1, , 2, , 3, , 4], x => x || 0); //  [1, 0, 2, 0, 3, 0, 4]
  Array.from({ length: 3 }, x => "text"); // ["text", "text", "text"]
  return null;
}

function ArrayBox() {
  // Array.of() 将一组值 转换为数组
  Array.of(1, 2, 3); // [1,2,3]
  // 如果没有参数则返回一个空数组

  // find() findIndex()

  // find() 找到第一个符合条件的数组成员, 找不到返回undefined
  let finda = [1, 2, 3, -4];
  finda.find(n => n < 0); // -4
  // fundIndex() 与find() 类似，只不过找不到的话返回 -1
  // 且两个都能找到NaN  indexOf()则不能

  // fill() 使用参数，填充一个数组， 空数组的初始化很方便，第二、三个参数分别指开始与结束位置
  let filla = ["a", "b", "c"];
  filla.fill(7); // [7,7,7]

  Array(3).fill(null); // [null, null, null]

  filla.fill(7, 1, 2); // ['a',7,'b']

  // 遍历数组  for of
  let a = ["a", "b"];
  // entries() keys() values()

  for (let i of a.keys()) {
    // i: 0, 1   keys()是对键名的遍历
  }

  for (let i of a.values()) {
    // i: 'a', 'b'   values()是对值的遍历
  }

  for (let [i, e] of a.entries()) {
    // console.log(i, e)
    // 0, 'a'    1, 'b'   entries()是对键值对的遍历
  }

  // incloudes()
  // 返回一个boolean 表示是否包含这个给定的值，第二个参数设定从哪开始，若大于数组长度则从零开始
  [1, 2, 3].includes(1); // true
  [1, 2, 3].includes(1, 1); // false
  [1, 2, 3].includes(1, 4); // true

  // flat() 拉平数组 返回一个新数组
  [1, 2, [3, 4]].flat(); // [1,2,3,4]

  // 默认只拉平一层 若拉平多层，参数设置层数
  let flata = [1, 2, [3, [4, 5]]];
  flata.flat(1); // [1,2,3,[4,5]]
  flata.flat(2); // [1,2,3,4,5]
  // 无论多少层都转一维
  flata.flat(Infinity); // [1,2,3,4,5]

  // 数组的空位
  Array(3); // [,,]
  // forEach() filter() reduce() every() some() 都会跳过空位
  // map() 会跳过，但会保留这个值
  // ES6则明确转化为 undefined
  // Array.from() ... 会将空位转化为undefined  fill()会正确识别空位 for...of 也会遍历
  // entries() keys() values() find() findIndex() 会将空位处理成 undefined

  // 规则不统一，尽量避免出现
  return null;
}

/**
 *
 *
 * Object
 *
 *
 *
 */

function ObjBox() {
  let a = 1;
  let obja = {
    a, // 属性简写 等同于 a:1
    hello(b) {
      // 方法简写
      return b;
    }
  };
  obja.hello(4); // 4

  let user = {
    name: "test"
  };

  let foo = {
    bar: "baz"
  };

  console.log(user, foo);
  // {name: "test"} {bar: "baz"}
  console.log({ user, foo });
  // {user: {name: "test"}, foo: {bar: "baz"}}

  let objb = {};

  // 对象赋值方法

  let b = "asd";
  objb[b] = 123;
  // objb  ---  asd: 123

  let objc = {
    [b]: 456
  };
  // objc  --  asd: 456

  // 也可以定义方法名
  let objd = {
    [b]() {
      return 123;
    }
  };
  objd.asd(); // 123

  // name属性
  // 返回函数名
  let obje = {
    say() {
      return 1;
    }
  };
  // obje.say.name --- say

  // 属性的遍历   五种
  // for...in  循环编辑对象自身的和继承的可枚举属性
  // Object.keys(obj) 返回一个数组，包括对象自身（不含继承）所有可枚举属性的键名
  // Object.getOwnPropertyNames(obj)  返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名
  // Object.getOwnPropertySymbols(obj)  返回一个数组，包含对象自身的所有 Symbol 属性的键名。
  // Reflect.ownKeys(obj)  返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

  // super() // 指向当前对象的原型对象
  // super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错
  // 目前，只有对象方法的简写法可以让 JavaScript 引擎确认，定义的是对象的方法

  // 对象的扩展运算符 ...

  let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
  // x, y, z  ===>  1  2  {a: 3, b: 4}
  // 要求解构赋值必须是最后一个参数，否则报错
  let { p, ...s } = [1, 2];
  // p   s  ===>  undefined {0:1, 1:2}

  // 解构赋值的拷贝是浅拷贝，只是拷贝了当前对象的指针，不是副本
  let aa = { a: { b: 1 } };
  let { ...bb } = aa;
  aa.a.b = 2;
  // bb.a.b => 2

  // 数组是特殊的对象，所以对象的扩展运算符也可以用户数组
  let as = { ...[1, 2, 3] };
  // as -> { 0:1,1:2,2:3 }

  // 对象的扩展运算符等同于 Object.assign()

  // a = {a:1}
  // {...a} === Object.assign({}, a) // a 为对象

  /*
  四种写法均相同
  { ...a, x: 1, y: 2 } === 
    { ...a, ...{ x: 1, y: 2 } } === 
    let x = 1, y = 2, aWithOverrides = { ...a, x, y } ===
    Object.assign({}, a, { x: 1, y: 2 })
  */

  // 扩展运算符后面可以跟表达式
  // ...(x === 0 ? {} : {a : 1})

  return null;
}

function ObjectMethods() {
  // 对象新增方法：
  // Object.is() 比较两个值是否相等 与 === 行为基本一致
  // Object.is('foo', 'foo') -> true
  // Object.is({}, {}) -> false

  // == 与 === 的问题
  // +0 === -0 -> true
  // Object.is(-0, +0) -> false

  // NaN === NaN -> false
  // Object.is(NaN, NaN) -> true

  // Object.assign() 用于对象的合并，并复制目标对象
  // 若目标对象和源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性
  // 如果只有一个参数，Object.assign会直接返回该参数
  // 如果该参数不是对象，则会先转成对象，然后返回
  // 若将null 或者 undefined 作为参数，会报错

  // Object.assign方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。
  // Object.assign() 可以处理数组，但会把数组视为对象（相同参数后者替换前者）

  // Object.keys()  Object.values()  Object.entries() 这三个新增方法，作为遍历一个对象的补充手段，供for...of 循环使用
  // Object.keys()
  // 返回一个数组，参数为对象自身所有可遍历的键名
  let a = { a: "bar", b: "as" };
  Object.keys(a); // ['a', 'b']

  // Object.values()
  //  返回一个数组，参数是对象自身所有可遍历的属性的键值
  Object.values(a); // ['bar', 'as']
  // 返回的参数顺序 -> 若属性名为数值，则按照数值的大小，从小到大遍历

  // Object.entries()
  // 返回一个数组，参数是对象自身所有可遍历的键值对数组
  Object.entries(a); // [['a', 'bar'], ['b', 'as']]

  // Object.fromEntries()
  // Object.entries() 的逆操作，用于 将一个键值对数组转为对象
  let b = [
    [1, 2],
    [3, 4]
  ];
  Object.fromEntries(b); // {1:2, 3:4}
  
  return null;
}
export default Box;
