_这是我完成答题之后的有问题的问题的记录，如果你们也想试一下的话可以到文末 clone 一波，自己试试。_

## var/let

```javascript
// 1
function a1() {
  console.log(name); // 显示 undefined 但不会报错，因为已经提升变量了，在运行到定义位置前都是undefined
  console.log(age); // 暂时性死区 ReferenceError
  var name = "Arthas";
  let age = 21;
}
```

## this

```javascript
// 3
const shape3 = {
  radius: 10,
  diameter() {
    return this.radius * 2;
  },
  perimeter: () => 2 * 10 * this.radius,
};
shape3.diameter(); // 20
shape3.perimeter(); // NaN
```

_常规函数内的 this 指向当前作用域(本对象)
箭头函数内的 this 指向它的父级作用域，当前情况下就是指向 window_

## Array

```javascript
// 4
const bird4 = {
  size: "small",
};
const mouse4 = {
  name: "Monica",
  small: true,
};
console.log(mouse4.bird4.size); // error
console.log(mouse4[bird4.size]); // true
console.log(mouse4[bird4["size"]]); // true
```

- 先寻找内部的内容，再找外层 bird4.size = 'small'; mouse4['small'] = true 第三个 log 同理\*
-

## new Number()

```javascript
// 7
let a7 = 3;
let b7 = new Number(3);
let c7 = 3;
console.log(a7 == b7); // true
console.log(a7 === b7); // false
console.log(b7 === c7); // false
```

_new Number() 属于内建的函数构造器，是一个 Object
== 的时候 只校验值 true
=== 的时候 校验值与类型 false_

## class

```javascript
// 8
class Chameleon8 {
  static colorChange(newColor) {
    this.newColor = newColor;
    return this.newColor;
  }
  colorChange2(newColor) {
    this.newColor = newColor;
    return this.newColor;
  }
  constructor({ newColor = "green" } = {}) {
    this.newColor = newColor;
  }
}
const freddie8 = new Chameleon8({ newColor: "purple" });
alert(freddie8.colorChange("orange")); // typeError
alert(freddie8.colorChange2("red")); // red
```

_static 是定义类的静态方法的关键词，这种方法只能被创造他们的构建器使用，不能传递给实例，所以不能被示例使用_

## Window

```javascript
// 9
let greting9;
greetign9 = {}; // 与上面的单词不符
console.log(greetign9); // {}
```

_log 显示 空对象，是因为我们在全局创建了一个对象
当写错单词时，JS 解释器在上浏览器中将它视为 global.greetign9 = {} or window.greetign = {}
如果要避免，可以使用严格模式 "use strict"_

## new Number()

```javascript
// 7
let a7 = 3;
let b7 = new Number(3);
let c7 = 3;
console.log(a7 == b7); // true
console.log(a7 === b7); // false
console.log(b7 === c7); // false
```

_new Number() 属于内建的函数构造器，是一个 Object
== 的时候 只校验值 true
=== 的时候 校验值与类型 false_

## Function&Object

```javascript
// 10
function bark10() {
  console.log("Woof");
}
bark10.animal = "dog";
console.log(bark10(), bark10.animal); // Woof undefined , dog
```

_这种写法是可行的，因为函数也是对象(除基本类型之外其他都是对象)
函数属于特殊的对象，上面的那些代码其实并不是一个实际的函数。
函数是一个拥有属性的对象，且属性可以被调用_

## class

```javascript
// 11
function Person11(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}
const member11 = new Person11("Arthas", "Monica");

// Wrong
Person11.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};
console.log(member11.getFullName()); // TypeError
/*
	不可以向常规对象那样，给构造函数添加属性
    如果想一次性给所有实例添加属性，使用原型
  */

// Right
Person11.prototype.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};
console.log(member11.getFullName()); // Arthas Monica
```

_这样做是有益的，如果将此方法添加到构造函数本身，也许不是每个 Person11 都需要这个方法。
这样会浪费大量的内存空间，因为它们仍然具有该属性，这将占用每个实例的内存空间。
如果只是将它添加到原型中，那么它只存在于内存中的一个位置，但是所有实例都可以访问它_

## class

```javascript
// 12
function Person12(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}
const arthas12 = new Person12("Arthas", "zzy");
const monica12 = Person12("Monica", "gss");

console.log(arthas12); // Person {firstName: "Arthas", lastName: "zzy"}
console.log(monica12, window.firstName, window.lastName); // undefined 'Monica', 'gss'
```

_对于 monica12，我们并没有使用 new。
当使用 new 时，this 引用我们创建的空对象
未使用 new 时，this 引用的是全局对象 (global object / window)
所以 当 this.firstName = 'Monica' 且 this.lastName = 'gss' 时
等于 window.firstName = 'Monica' window.lastName = 'gss'
而 monica12 本身则是 undefined_

## 13 click

\*事件传播的三个阶段
在捕获(**captruing**)阶段中，事件从祖先元素乡下传播到目标元素。
当时间到达目标(**target**)元素后
冒泡(**bubbling**)才开始
**captuing - target - bubbling\***

## 14 Object

**\*除去基本对象，所有对象都有原型。**
基本对象可以访问一些方法和属性，比如 .toString()
所有的这些方法在原型上都是可用的。
虽然 JavaScript 不能直接在对象上找到这些方法，但 JavaScript 会沿着原型链找到它们。\*

## 隐式类型转换

```javascript
// 15
function sum15(a, b) {
  return a + b;
}
console.log(sum15(1, +"2")); // 3
console.log(sum15(1, "2")); // '12'
```

## 标记模版字变量

```javascript
// 17
function getPersonInfo17(one, two, three) {
  console.log(one);
  console.log(two);
  console.log(three);
}
const person17 = "Arthas";
const age17 = 21;

getPersonInfo17`${person17} is ${age17} years old`; // "", " is ", " years old"]   "Arthas"   21
```

_使用标记模版字变量，第一个参数总是包含字符串的数组，其余的参数获取的是传递的表达式的值_

## Object

```javascript
// 18
let obj18 = { a: 1 };
let b18 = obj18;

console.log(obj18 == b18); // true
console.log(obj18 === b18); // true
console.log(obj18 == { a: 1 }); // false
console.log(obj18 === { a: 1 }); // false
console.log(b18 == { a: 1 }); // false
console.log(b18 === { a: 1 }); // false
console.log({ a: 1 } == { a: 1 }); // false
console.log({ a: 1 } === { a: 1 }); // false
```

\*判断其相等与否时，基本类型通过值来进行比较，而对象通过它们的**引用**(refreence)进行比较。
JavaScript 检查对象是否具有对内存中 **相同位置的引用\***

## 扩展运算符

```javascript
// 19
function getAge19(...args) {
  console.log(typeof args);
}
getAge19(21); // object
```

_扩展运算符会返回实参组成的数组，而数组是对象，返回 object_

## 严格模式

```javascript
// 20
function getAge20() {
  "use strict";
  age = 21;
  console.log(age);
}
getAge20(); // ReferenceError
```

**\*'use strict' 进入严格模式，未声明变量将抛出 引用错误**
如果不使用严格模式，age 将会在全局声明 log 就会是 21\*

## Object

```javascript
// 25
const obj25 = { a: "Ass", b: "Monica", a: "Arthas" };
console.log(obj25); // {a: 'Arthas', b: 'Monica'}
```

_如果有两个相同的键名，排在前面的会被后面的替换掉。_

## Array

```javascript
// 29
const a29 = {};
const b29 = { key: "b" };
const c29 = { key: "c" };

a29[b29] = 123;
a29[c29] = 456;
console.log(a[b]); // 456
```

**\*对象的键会被自动转化为字符串。**
但是当字符串化一个对象的时候，会变成 "[Object Object]" 所以 a["Object Object"] = 123
然后又做了一次相同的事情，这时候 a["Object Object"]的值又被改成了 456
所以 a[b] 返回 456\*

## call&bind&apply

```javascript
// 33
const person33 = { name: "Arthas" };
function sayHei33(age) {
  console.log(`${this.name} is ${age}`);
}
sayHei33.call(person33, 21); // 立即执行
sayHei33.bind(person33, 21)(); // 不会立即执行，需要调用
sayHei33.apply(person33, [21]); // 参数是一个数组的集合，其余和call一样
```

## reduce

```javascript
// 40
[
  [0, 1],
  [2, 3],
].reduce(
  (acc, cur, idx, arr) => {
    return acc.concat(cur); // [1, 2, 0, 1, 2, 3]
  },
  [1, 2]
);
/*
  	reduce(
      func, -> 累加器 可选
        total -> 初始值，或者计算结束之后的返回值
        currentValue -> 当前元素
        currentIndex -> 当前元素的下标
        arr -> 当前元素所在的数组对象
      initVal -> 初始值 可选
    )
	*/
```

**\*reduce 方法是接受一个函数作为累加器，数组中的每个值从左往右开始缩减，最终计算成一个值。**
reduce 可以作为一个高阶函数，用于 compose 函数
reduce 参数为空是不会执行回调函数的\*

## setInterval

```javascript
// 42
let timer42 = setInterVal(() => console.log("time"), 1000);
console.log(timer42); // 某一id
clearInterVal(timer42);
console.log(timer42); // null
```

_setInerval 方法返回一个唯一的 id，用于 clearInterval_

## 45 Promise

_Promise.race() 方法中传入多个 Promise 时，会优先解析。
哪个先成功，哪个就是返回内容_

## Object

```javascript
// 46
let person46 = { name: "Arthas" };
const members46 = [person46];
const members2_46 = [person46];
person46 = null;
console.log(members46); // [{name: 'Arthas'}]

members2_46.name = null;
console.log(members46); // [{name: null}]
```

## map

```javascript
// 50
let a50 = [1, 2, 3].map((num) => {
  if (typeof num === "number") return;
  return num * 2;
});
// [undefined,undefined,undefined]
```

_map 中 if 判定为 true，但是 return 并没有返回任何值，map 默认返回 undefined_

## 函数

```javascript
// 51
function getInfo51(member, year) {
  member.name = "Monica";
  year = "2000";
}
const person51 = { name: "Arthas" };
const birthYear51 = "1999";
getInfo51(person51, birthYear51);
console.log(person51, birthYear51); // {name: 'Monica'}, '1999'
```

**\*普通参数都是值传递的，但是对象不一样，是引用传递。**
person51 是个对象，参数 member 引用与之相同的对象。当修改 member51 所引用的对待的属性时，person51 也被修改了，因为他们引用了相同的对象\*

## class&Function

```javascript
// 53
function Car53() {
  this.make = "Monica";
  return { make: "Arthas" };
}
const myCar53 = new Car53();
console.log(myCar53.make); // Arthas
```

**_返回属性的时候，属性的值等于 返回 的值，而不是构造函数中设定的值。_**

## let&window

```javascript
// 54
const a54 = () => {
  let x = (y = 10);
};
console.log(typeof x); // undefined
console.log(typeof y); // 10
```

_y 属于全局定义 window.y = 10 所以 typeof y 是 'number'
x 内部定义，外部获取不到，所以 typeof x 是 'undefined'_

## new Number()

```javascript
// 7
let a7 = 3;
let b7 = new Number(3);
let c7 = 3;
console.log(a7 == b7); // true
console.log(a7 === b7); // false
console.log(b7 === c7); // false
```

_new Number() 属于内建的函数构造器，是一个 Object
== 的时候 只校验值 true
=== 的时候 校验值与类型 false_

## class

```javascript
// 55
class Dog55 {
  constructor(name) {
    this.name = name;
  }
}
Dog55.prototype.bark = function () {
  console.log(`woof i am ${this.name}`);
};
const pet55 = new Dog55("Mara");
pet55.bark(); // woof i am Mara
delete Dog55.prototype.bark;
pet55.bark(); // TypeError
```

## 57 export

**\*引入的模块都是只读的，只有导出他们的模块才可以修改值。**
当在导入其模块的文件进行改值时，会抛出异常：[参数]是只读的，不能被修改\*

## defineProperty

```javascript
// 61
const person61 = { name: "Arthas" };
Object.defineProperty(person61, "age", { value: 21 });
console.log(person61); // {name: 'Arthas', age: 21}
console.log(Object.keys(person61)); // ['name']
```

**\*definedProperty 可以给对象添加一个新属性，或者修改已存在的属性.**
但是新增的属性，属性默认为不可枚举的，所以 Object.keys()方法返回对象键名，只返回了 name
defineProperty 添加的属性默认不可变，但可以通过 writable, configurable 和 enumerable 属性来改变这一行为。\*

## JSON.stringify()

```javascript
// 62
const settings62 = {
  username: "Arthas",
  level: 21,
  health: 90,
};
const data62 = JSON.stringify(settings62, ["level", "health"]);
console.log(data62); // "{"level":19, "health":90}"
```

**\*JSON.stringify 的第二个参数是 替代者(replacer) replacer 可以是一个函数或者数组，用于控制那些值可以转换为字符串。**
如果 replacer 是一个数组，那么就只有包含在数组中的属性会被转化为字符串。
如果 replacer 是一个函数，这个函数将被对象的每一个属性都调用一次。函数返回的值就是这个属性的值，最终体现在转化后的 JSON 字符串中。
Chrome 下，如果所有函数均返回同一个返回值的时候会有异常，会直接将返回值作为输出结果，而不会输出字符串
如果函数返回 undefined，则该属性会排除在外\*

## 函数默认值/Object

```javascript
// 64
const value64 = { number: 10 };
const multiply64 = (x = { ...value64 }) => {
  console.log((x.number *= 2));
};
multiply64(); // 20
multiply64(); // 20
multiply64(value64); // 20
multiply64(value64); // 40
```

_第一次调用的时候属于是传入默认值，所以修改也只是修改默认值 x 对象内的值
第二次调用的时候，x 又回到了默认值状态，所以和上一次打印内容相同
第三次调用传入了值，修改 x 的值的时候，属于修改了 value64 对象内的值，为 20
第四次调用与第三次相同，但是第三次调用的时候已经修改了 value64 的值，所以为 40_

## reduce

```javascript
// 65
[1, 2, 3, 4].reduce((x, y) => {
  return console.log(x, y);
});
//  1 2 , undefined 3 , undefined 4
```

**_reducer 函数接受四个参数
Accumulator (acc) (累计器)
Current Value (cur) (当前值)
Current Index (idx) (当前索引)
Source Array (src) (源数组)_**

_reducer 函数的返回值将会分配给累加器，该返回值在数组的每个迭代中被记住，并最后成为最终的单个结果值
reducer 还有一个可选参数 initialValue,该参数将作为第一次调用毁掉函数时的第一个参数的值。如果没有提供默认选择数组中的第一个元素。
第一次调用 x - 1 y - 2
第二次调用 由于没有返回任何值，只是打印，所以会默认返回 undefined 所以 累加器 x - undefined y - 3
第三次 同上 x - undefined y - 4_

## class

```javascript
// 66
class Dog66 {
  constructor(name) {
    this.name = name;
  }
}
class Labrador66 extends Dog66 {
  constructor(name, size) {
    super(name);
    this.size = size;
  }
  /*
      error

      constructor(name, size) {
        this.size = size;
      }
      // 调用super之前使用this会报错

      constructor(size) {
        super(name);
        this.size = size;
      }
      // 构造器内没有name参数

      constructor(name, size) {
        this.name = name;
        this.size = size;
      }
      // 调用super之前使用this会报错
    */
}
```

## import

```javascript
// 67
// index.js
console.log("running index.js");
import { sum } from "./sum.js";
console.log(sum(1, 2));

// sum.js
console.log("running sum.js");
export const sum = (a, b) => a + b;

// 'running sum.js'  'running index.js'  3
```

**\*import 命令是编译阶段执行的，在代码执行之前。**
意味着被导入的模块先被执行，随后才是导入模块的文件
这也是 import()与 require()的区别
前者先被执行，后者根据代码依次加载依赖\*

## generator

```javascript
// 71
function* startGames71() {
  const 答案 = yield "Do you love JavaScript?";
  if (答案 !== "Yes") {
    return "Oh wow... Guess we're gone here";
  }
  return "JavaScript loves you back ❤️";
}
const game71 = startGames71();
console.log(/* ? */); // Do you love JavaScript?
// game71.next().value

console.log(/* ? */); // JavaScript loves you back ❤️
// game71.next('Yes').value
```

**\*generator 函数在遇到 yield 时会暂停其执行。**
第一个很简单， 正常的 game71.next().value 即可
yield 本身是没有返回值的，所以这时候 常量 '答案' 的值是 undefined
next 方法可以携带一个参数，该参数会被当作上一个 yield 表达式的返回值。
所以调用 game71.next('Yes').value 时，undefined 被替换成了 'Yes',即达到要求。
_/_

## push

```javascript
// 74
function addToList74(item, list) {
  return list.push(item);
}
const result74 = addToList74("apple", ["banana"]);
console.log(result); // 2
```

**_push 方法返回值是当前数组的长度_**

## freeze

```javascript
// 75
const box75 = { x: 10, y: 20 };
Object.freeze(box75);
const shape75 = box75;
shape75.x = 100;
console.log(box75); // {10, 20}
```

**_freeze 冻结对象
不可改变对象任何属性，永远保持其原来的变化_**

## function

```javascript
// 78
const add78 = () => {
  // 为add78的参数
  const cache = {};
  return (num) => {
    // num 为赋值后函数的参数(addFunction78)
    if (num in cache) {
      return `from cache ${cache[num]}`;
    } else {
      const result = num + 10;
      cache[num] = result;
      return `Calculated! ${result}`;
    }
  };
};
const addFunction78 = add78();
addFunction78(10); // Calculated 20
addFunction78(10); // from cache 20
addFunction78(5 * 2); // from cache 20
```

**_if( x in y) 语句为判断 y 内是否存在 x 键名，有则 true，无则 false_**

## function

```javascript
// 81
function sayHi81(name) {
  return `Hi there, ${name}`;
}
console.log(sayHi81()); // Hi there, undefine
```

**_函数的参数默认值为 undefined_**

## function

```javascript
// 88
function sum88(num1, num2 = num1) {
  console.log(num1 + num2);
}
sum88(10); // 20
```

_可以将默认参数设置为另一个默认参数，只要另一个参数定义在要设置的参数之前即可_

## import

```javascript
// 89
// modules.js
export default () => "Hello world";
export const name = "Arthas";

// index.js
import * as data from "./module";
// console.log(data) // { default: function default(), name: "Lydia" }
```

**_import _ as [name] 语法，可以将 module.js 中所有的 export 导入到 idnex.js 中，并创建了一个 data 的新对象。**
data 对象具有默认导出 default 属性，其他属性具有指定 export 的名称即对应的值

## prototype

```javascript
// 92
function giveArthasaPizza92() {
  return "here is pizza";
}
const giveArthasChocolate92 = () =>
  "here`s chocolate... now go hit the gym already";

console.log(giveArthasaPizza92.prototype); // {constructir: ...}
console.log(giveArthasChocolate92.prototype); // undefined
```

_常规函数是有 prototype 属性的
剪头函数是没有 prototype 属性的，尝试调用会返回 undefined_

## function

```javascript
// 7
function getItems94(frultList, favoriteFruit, ...args) {
  return [...fruitList, favoriteFruit, ...args];
}
getItems94(["banana", "apple"], "pear", "orange"); // [ 'banana', 'apple', 'orange', 'pear' ]
```

**_...args 是剩余参数，剩余参数的值是一个包含所有剩余参数的数组，只能放在最后。_**

```javascript
  // error code
  function getItems(fruitList, ...args, favoriteFruit) {
    return [...fruitList, ...args, favoriteFruit]
  }
  getItems(["banana", "apple"], "pear", "orange") // SyntaxError
```

## Symbol

```javascript
// 97
const info97 = {
  [Symbol("a")]: "b",
};
console.log(info); // {Symbol('a'): 'b'}
console.log(Object.keys(info97)); // []
```

**\*Symbol 类型是不可枚举的**，而 Object.keys()是返回对象上所有可枚举的属性，所以这里打印显示为 []\*

## error 错误汇总

```javascript
// 99 错误汇总
/*
      SyntaxError 语法错误 a 解析代码时发生的语法错误
      ReferenceError 引用错误 a 引用了一个不存在的变量 b 将变量赋值给一个无法被赋值的对象
      RangeError 范围错误 超出有效范围
      TypeError 类型错误 a 当值不是预期类型时，会抛出TypeErrors b 调用对象不存在的方法
      URLError URL错误
      */
```

## &&

```javascript
// 100
let puestion100 = [] && "im"; // 'im' [] 是一个真值
```

## Promise&async&await

```javascript
// 102
const myPromise102 = () => Promise.resolve("i have resolved");
function firstFunction() {
  myPromise102().then((res) => console.log(res));
  console.log("second1");
}
async function secondFunction() {
  console.log(await myPromise102());
  console.log("second2");
}
firstFunction(); // second1 i have resolved
secondFunction(); // i have resolved second2
```

_Promise 的执行方式是运行到 Promise，Promise 进入微任务队列，知道宏任务完成(打印 'second1')，执行微任务('i have resolved')
async/await 执行方式是运行到 await 后，通过 await 关键字，暂停了后续代码的执行，直到异步代码被解析才开始后面代码的执行，也就是说 执行完 'i have resolved' 之后，才去运行 console.log('second2') 的_

## setInterval

```javascript
// 114
let config114 = {
  alert: setInterval(() => {
    console.log("Alert");
  }, 1000),
};
config114 = null;
```

_一般对象赋值为 null 后，那些对象就会被进行 垃圾回收，因为没有对这些对象的引用了，但是 setInterval 的参数是一个箭头函数，回调函数仍然保持着对 config114 的引用。
只要存在引用，对象就不会被垃圾回收。
所以会一直执行
如果需要暂停就要 clearSetInterval()_

## function

```javascript
// 116
const person116 = {
  name: "Monica",
  age: 20,
};

const changeAge116 = (x = { ...person116 }) => (x.age += 1);
const changeAgeAndName = (x = { ...person116 }) => {
  x.age += 1;
  x.name = "Arthas";
};
changeAge116(person116);
changeAgeAndName();
console.log(person116); // { name: 'Monica', age: 21 }
```

_changeAge 方法传递了 person116 参数，意味着 函数内 x 与 person116 在同一位置，操作 x.age 等同于操作 person116.age 所以为 { name: 'Monica', age: 21 }
changeAgeAndName 方法设置默认值为一个对象，内部含有解构了的 person116 ，属于一个新的对象，所以这个函数内部 x 的操作并不影响 person116，所以最终打印下来是 { name: 'Monica', age: 21 }_

## 可选链操作符 ?.

```javascript
// 119
const person119 = {
  firstName: "Arthas",
  lastName: "Monica",
  pet: {
    name: "Woo",
    breed: "Dutch Tulip Hound",
  },
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  },
};

console.log(person119.pet?.name); // Woo
console.log(person119.pet?.family?.name); // undefined
console.log(person119.getFullName?.()); // Arthas Monica
console.log(member.getLastName?.()); // ReferenceError
```

**\*ES10 或 TS3.7+ 新增可选链操作符 ?. 不再需要显示的检测更深层的嵌套值是否有效。**
如果尝试获取是 undefined or null 的值，表达式将会短路并返回 undefined
person119.pet?.name: person119 内是否含有 pet 属性，有的话获取内部属性 name 的值，否则返回 undefined
person119.pet?.family?.name
等同于三元表达式：
person119.pet ? person119.pet.family ? person119.pet.family.name : undefined : undefined
person119.getFullName?.() 判断函数的话在括号()前使用其符号进行判断，有就进行调用，无则返回 undefined
member.getLastName?.() 并没有 member 这个变量，所以走不到下一步就会报 ReferenceError\*

## setter

```javascript
// 121
const config121 = {
  languages: [],
  set language(lang) {
    return this.languages.push(lang);
  },
};
console.log(config121.language); // undefined
```

_方法 language 是一个 setter. **setter 并不保存实际的值，功能是修改属性**，调用 setter ,返回 undefined_

## saync&generator

```javascript
// 124
async function* range124(start, end) {
  for (let i = start; i <= end; i++) {
    yield Promise.resolve(i); // Promise{i}...
  }
}
(async () => {
  const gen = range124(1, 3);
  for await (const item of gen) {
    console.log(item); // 1 2 3
  }
})();
```

_range124(1, 3)这个函数得到的值是 [Promise{1},Promise{2},Promise{3}]
在进行 for...of 前加了 await 使得原本 item 的值(Promise{1/2/3})得到了转变，从而拿到了 1 2 3_

## function

```javascript
// 125
const myFunc125 = ({ x, y, z }) => {
  console.log(x, y.z);
};
myFunc125(1, 2, 3); // undefined undefined undefined
```

_myFunc125 函数期望接收一个包含 x,y,z 属性的对象作为参数。
但实际上只是传递了三个参数，并不含有 x,z,y 的键值对，x,z,y 都含有默认值，就是 undefined_

## 解构

```javascript
// 127
const spookyItems127 = ["👻", "🎃", "🕸"];
({ item: spookyItems127[3] } = { item: "💀" });
console.log(spookyItems127); // ["👻", "🎃", "🕸", "💀"]
```

_通过解构，可以从右边的对象中拆出来值，并将值分配给左边对象同名的属性。_

## Number.isNaN()/isNaN()

```javascript
// 7
const name128 = "Arthas";
const age128 = 21;

console.log(Number.isNaN(name128)); // false
console.log(Number.isNaN(age128)); // false

console.log(isNaN(name128)); // true
console.log(isNaN(age128)); // false
```

_Number.isNaN() 判断传递的值是否为数字切等价于 NaN，等价为 true，反则 false
isNaN() 是通过参数判断是否可以转化为 Number，转化成功为 false，失败为 true_

## Promise&saync&setTimeout

```javascript
// 133
const myPromise133 = Promise.resolve(Promise.resolve("Promise!"));
function funcOne133() {
  myPromise133.then((res) => res).then((res) => console.log(res));
  setTimeout(() => console.log("Timeout!", 0));
  console.log("funcOne Last line!");
}

async function funcTwo133() {
  const res = await myPromise133;
  console.log(await res);
  setTimeout(() => console.log("Timeout!", 1));
  console.log("funcTwo Last line!");
}

funcOne133();
funcTwo133();
// funcOne Last line! , Promsie! , Promise! , funcTwo Last line! , Timeout 0, Timeout 1
```

funcOne133
第一行是 Promise 异步处理
第二行是定时器，需要等调用栈为空才会执行此操作
第三行执行！ funcOne Last line!
此时开始异步 Promise 处理，得到 Promise!
此时因为接下来还有 funcTwo133，调用栈不为空，继续等待
funcTwo
第一行 await 暂停函数等待结果
第二行 log await 暂停函数，知道得到结果 打印 Promise!
第三行是定时器，需要等调用栈为空才会执行此操作
第四行执行！ funcTwo Last line!
此时调用栈为空，事件队列中等待的回调函数(定时器们)在此入栈。
执行 funcOne133 函数内的定时器 "Timeout!", 0 ，接着执行 funcTwo133 函数内的定时器 funcTwo Last line!

## import

```javascript
  // 134
  // 如何在index.js中调用 num.js 中的 num?
  // sun.js
    export default sum(x){
      return x + x
    }
  // index.js
    import * as sum from './index.js'

  // Answer
  // sum.default(4)
```

_导入模块时，使用 _ 会以对象中键值对的形式导入文件内所有值，包括默认和具名。
{
default: '默认导出',
name: 'Arthas' // 普通导出
}\*

## Object.seal()

```javascript
// 136
const person136 = { name: "Arthas", age: 1 };
Object.seal(person136);
person136.name = "Moncica"; // 可影响对象，产生副作用
```

_Object.seal 防止新属性被添加，或存在属性被删除
但是仍然可以对存在属性进行修改_

## class

```javascript
// 139
class Counter139 {
  #number = 10;
  add() {
    this.#number++;
  }
}
const counter139 = new Counter139();
counter139.add();
console.log(counter139.#number); // SyntaxError
```

**\*ES10 中，通过 # 可以给 class 添加私有变量**。在 class 外部无法获取该值
尝试获取就会报语法错误\*

## Function&Object

```javascript
// 141
const person141 = {
  name: "Arthas",
  hobbies: ["coding"],
};
function addHobby141(hobby, hobbies = person141.hobbies) {
  hobbies.push(hobby);
  return hobbies;
}
addHobby141("running", []);
addHobby141("dancing");
addHobby141("baking", person141.hobbies);

console.log(person.hobbies); // ['coding', 'dancing', 'baking']
```

_第一次函数调用：第二个参数为空数组，并没有使用默认参数，所以只是 push 到了空数组内
第二次：第二个参数默认使用 person141.hobbies 的值，这时函数内的参数 hobbies 与 person141.hobbies 的引用地址相同，所以直接 push 到了 person141 对象内的 hobbies 属性中
第三次：同上，只不过是使用的参数直接就是 person141.hobbies 了，所以一样的引用地址，一样的处理方式_

## class

```javascript
// 142
class Arthas142 {
  constructor() {
    console.log("i am Arthas");
  }
}
class Monica142 extends Arthas142 {
  constructor() {
    console.log("i am Monica");
    super();
  }
}
const pet142 = new Monica142();
// i am Monica i am Arthas
```

_当实例化这个实例(new)，Monica142 中的 constructor 被调用，打印 'i am Monica'，随后调用 super()，super() 调用父类的构造函数，打印 'i am Arthas'_

## Object

```javascript
// 150
const animals150 = {};
let dog150 = { emoji: "🐶" };
let cat150 = { emoji: "🐈" };

animals150[dog150] = { ...dog150, name: "Mara" };
animals150[cat150] = { ...cat150, name: "Sara" };

console.log(animals150[dog150]); // { emoji: "🐈", name: "Sara" }
```

**\*对象的键名会被转换成字符串。**
animals150[dog150] 等同于 animals150["object Object"]
第二次同理，也就是说 animals150 对象内 "object Object" 属性的值被覆盖了。\*

## Object

```javascript
// 151
const user151 = {
  email: "my@email.com",
  updateEmail: (email) => {
    // this ---> window
    this.email = email;
  },
};

user151.updateEmail("new@email.com");
console.log(user151.email); // 'my@email.com'
```

_箭头函数内的 this 并没有绑定 user151，意味着 this 并不会引用 user151 对象，所以调用事件之后 user151.email 值并不会改变_

### [我自己记录此文件的 GitHub 地址(希望可以得到你的肯定)](https://github.com/Weibienaole/CodeSummary/tree/master/javascript-questions)

#### [原文 GitHub 地址](https://github.com/lydiahallie/javascript-questions)

### 如果对本文有疑问的话，评论区见～
