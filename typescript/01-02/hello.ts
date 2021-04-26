
// 1 hello
console.log('hello ts');

// 2 基础设定
// 设定a type 为 number 且之后只能是 number  转译时会报错，但由于符合js规范，也是可以转译成js的
let a:number

a = 1

let b: string

b = 'hello'

// 如果声明变量同时赋值，ts会对赋值进行检测
let c: boolean = true

c = false



function sum(a: number, b: number) : number /* 设定函数返回值类型 */{
  return a + b
}
sum(123, 456) // 579


// 3  类型

// 字面量
let a3: 10
// a3 = 11 -- 错误的，只能是 10

let b3: 'aaa' | 12 // 只能是 'aaa' 或者 12
let c3: boolean | number // 可以是 boolean 或者 number
// | 联合类型 来连接多个类型

// any  表示任意类型，一个变量设置any意味着关闭了ts类型检测
// 不建议
// 声明变量 如果不指明类型，则会自动设置为 any (隐式any)
let d3: any = 10
d3 = 'aa'
d3 = false

// d的类型是any,他可以赋值给任意值
a3 = d3

// unknow 表示未知类型的值

let e3: unknown = 10
e3 = '11'
e3 = true