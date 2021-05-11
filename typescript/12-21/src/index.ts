// abstract 设定此类为抽象类，只能用来被继承，不能用来 new 创建
abstract class Animal {
  name: string
  // 设定静态属性，只能有当前类调用，其余都不行
  static Arthas: string = 'Arthas'
  constructor(name: string) {
    this.name = name
  }
  say() {
    console.log('动物叫')
  }
  // 设定一个抽象方法，以 abstract 开头，没有方法体，子类继承之后必须对此方法进行重写
  abstract wofo(): void
  // 设定静态方法，只能有当前类调用，其余都不行
  static oo() {
    console.log('i am ii')
  }
}


/*
  继承内可以覆盖父类方法，constructor也包括其中
  如果在Dog子类中设置新的参数，需要在 constructor 中设置，super 为父类，在 constructor 中调用 super 即可将父类 constructor 复制一份到子类 constructor 中
  但是在子类在仍然要重新声明父类参数的类型
*/
class Dog extends Animal {
  age: number
  constructor(name: string, age: number) {
    super(name)
    this.age = age
  }
  // 覆盖父类方法
  say() {
    console.log('wwwww')
  }

  // 对抽象方法 wofo 进行重写
  wofo() {
    console.log('i am wofo')
  }
}
const dog = new Dog('wufu', 12)
console.log(dog)
dog.say()
dog.wofo()

/**
 * 接口
 * 定义一个类的规范
 * 接口只定义结构
 * 接口中所有的属性都没有实际的值，接口中所有的方法都是抽象方法
 * 可以重复声明，声明之后将属性合并
 * 在类中使用 接口 时，使用 implements(实现) 来设定 接口名，进行使用
 * 接口也可以用来声明对象的规范
 */
interface myInter {
  name: string
  gender: string
  setAge(age: number): void
}
interface myInter {
  age: number
}
let obj: myInter = {
  name: 'Arthas',
  gender: '男',
  age: 21,
  setAge(a: number = 1) {
    this.age = a
  }
}
class Aowu implements myInter {
  name: string
  gender: string
  age: number
  constructor(name: string, gender: string, age: number) {
    this.name = name
    this.gender = gender
    this.age = age
  }
  setAge(age: number) {
    this.age = age
  }
}
