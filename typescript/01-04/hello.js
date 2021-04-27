// 1 hello
console.log('hello ts');
// 2 基础设定
// 设定a type 为 number 且之后只能是 number  转译时会报错，但由于符合js规范，也是可以转译成js的
var a;
a = 1;
var b;
b = 'hello';
// 如果声明变量同时赋值，ts会对赋值进行检测
var c = true;
c = false;
function sum(a, b) {
    return a + b;
}
sum(123, 456); // 579
// 3  类型 -  简单类型
// 字面量
var a3;
// a3 = 11 -- 错误的，只能是 10
var b3; // 只能是 'aaa' 或者 12
var c3; // 可以是 boolean 或者 number
// | 联合类型 来连接多个类型
// any  表示任意类型，一个变量设置any意味着关闭了ts类型检测
// 不建议
// 声明变量 如果不指明类型，则会自动设置为 any (隐式any)
var d3 = 10;
d3 = 'aa';
d3 = false;
// d的类型是any,他可以赋值给任意值
a3 = d3;
// unknow 表示未知类型的值 属于安全类型的any
// 不可以直接赋值给其他变量
var e3 = 10;
e3 = '11';
e3 = true;
// a3 = e3 // 会报错  any不会报错，unknow会  -- 区别
// 赋值给其他变量的方式
// 1.使用typeof先做好类型检测
if (typeof d3 === 'boolean') {
    d3 = e3;
}
// 2. 类型断言(as)，告诉ts该变量的实际类型
c3 = e3;
// 或者
c3 = e3;
// void  空值，一般用于 function 的返回值
function f3() {
    // return 123 // 会报错
    // 等同于 return undefined || return null
}
// never 永远不会返回值  一般用于会中断的函数中，中断之后就不会再执行，也就不会有任何返回值(包括 undefined， null)
function g3() {
    throw new Error('主动弹出错误，中断执行！');
}
// 4 - 复杂类型
// object 指定为 object类型
// 但是 object有很多种形式   函数，数组...
var a4 = {};
a4 = function () { };
a4 = [];
// {} 指定 当前变量只能为 对象格式{}
// {} 内指定参数名称，类型
var b4;
b4 = { name: 'Arthas' }; // 不报错
// b4 = { name: 'Arthas', age: 18 } // 失败，有额外键值对，但是并没有设定键值对类型
// b4 = {gender: '男'} // 失败，键名不是name
// b4 = {name: 18} // 失败，键值类型不是 string
// 可以在属性名后加 ? 来告知ts此属性可能存在
var c4;
c4 = { name: 'Monica', age: 18 };
c4 = { name: 'Arthas' }; // 不报错
// [propsName: string]: any  表示对象中可以有任意类型的键值对
var d4;
d4 = { name: 'Arthas', age: 18, gender: '男' }; // 不报错
// function 的参数声明及返回声明
// 以箭头函数的形式声明
var e4;
// 也可以在函数内直接声明，并设置返回
e4 = function (numa, numb) {
    return numa < numb;
};
e4(+'4', 3); // false
e4(2, 3); // true
// array 类型声明
// 方式 Array<string>  || string[]
var f4 = [];
// f4 = ['1', '2', '3', '4', 5] // 报错，因为 5 是 number
f4 = ['1', '2'];
var g4 = [];
g4 = [true, false];
// ts 新增
// 元组  固定长度的数组
var h4;
h4 = ['zzy', 21, true];
// h4 = ['Arthas', 18, '男'] // 错误， 第三个值应该是 boolean，但是是 string
// 枚举 enum  取值被限定在一定范围内的场景
var Gender;
(function (Gender) {
    // 默认赋值 从0开始 也可以主动赋值
    Gender[Gender["Male"] = 0] = "Male";
    Gender[Gender["Female"] = 1] = "Female";
    Gender[Gender["None"] = 2] = "None";
})(Gender || (Gender = {}));
var i4;
i4 = { name: 'Arthas', age: 21, gender: Gender.Male }; // Gender.Male === 0
i4.gender; // 0
// & 表示同时实现
var j;
j = { name: 'Arthas', age: 21 }; // 缺一不可
var k;
var l;
// k 的类型等同于 l 的类型
k = 3;
// k = 5 // 出错 因为不在字面量之内
