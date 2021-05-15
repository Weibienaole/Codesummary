class Person {
  /*
    ts 可以在属性前添加的修饰符
      public 公共属性 可以在任何位置进行修改，获取，声明的属性默认为 public
      private 私有属性 只可以在当前类中 读取，修改
      protected 受保护属性 可以在当前类和继承子类中读取，修改
        修改私有属性，受保护属性 需要使用 ES6的 set get 来进行修改

  */

  public _name: string
  private _age: number
  protected _gender: string
  constructor(name: string, age: number, gender: string) {
    this._name = name
    this._age = age
    this._gender = gender
  }

  // 读取,修改私有属性，受保护属性
  get age() {
    return this._age
  }
  set age(val: number) {
    if (val >= 0) this._age = val
  }
}

const A = new Person('Arthas', 19, '男')
console.log(A.age)
A.age = 20
console.log(A.age)

class B extends Person {
  get gender() {
    return this._gender
  }
  set gender(val: string) {
    this._gender = val
  }
}
const C = new B('Monica', 21, '女')
console.log(C.gender)
C.gender = '男'
console.log(C.gender);

