/*
  泛型
  在定义函数或者类时，遇到类型不明确就可以实现 泛型
*/
function fn<T>(name: T): T {
  return name
}

// 不指定泛型 可以让 ts 自动检测类型
fn('Arthas') // string
// 指定泛型 也可以直接定义类型
fn<number>(12)

function fn2<T, K>(b: T, c: K): T {
  console.log(c)
  return b
}

fn2('Arthas', 12)

fn2<number, string>(21, 'Monica')

interface MyType {
  name: string
  age: number
}

// 可以使用 继承 将 接口 内的 类型 为函数指定 类型
// T 继承 MyType类型。 也就是指定一个对象，对象内含有 string 的 name, number 的 age 返回值必须含有 string 的 name, number 的 age
function fn3<T extends MyType>(a: T): T {
  return a
}
fn3({name: 'Arthas', age: 12})

// class也可以使用 泛型

class PersonS<T>{
  num: T
  constructor(num: T){
    this.num = num
  }
}

const As = new PersonS('Arthas  asas')
console.log(As.num);
