import React from "react";
import exdef, {model, models, a, Arthas} from "./model";
 // export default 导出的模块不需要大括号
/*
  import 中若想重命名，可以使用 as 关键字  
    import { a as b } from '...'
  此时 a 就修改为了 b

  而且 import 命令输入的变量都是只读的，不可以修改，否则会报错
  但如果a是一个对象，修改a的属性就可以，但建议不要这么做

  import 具有变量提升效果，会提升到这个模块的头部，首先执行

  import 是静态执行，所以不能添加表达式和变量，否则会报错

  多次重复同一个 import 语句，只会执行一次
*/
function Box() {
  return (
    <div>
      <h2>Class/Class继承/Model</h2>
      <ClassBox></ClassBox>
      <InheritBox></InheritBox>
      <ModelBox></ModelBox>
    </div>
  );
}

function ClassBox() {
  function Point(x, y) {
    this.x = x * x;
    this.y = y * y;
    return x, y;
  }
  Point.prototype.toString = function() {
    return this.x + "，" + this.y;
  };
  let b = new Point(2, 3).toString(); // 4, 9
  // console.log(b)

  class Pointa {
    /*
      constructor 方法是类的默认方法，通过new生成对象实例时，默认调用该方法，一个类必须要有constructor方法，如果没有显式定义，将会被默认添加

      consyurctor方法默认返回一个实例对象（即this），也可以指定返回另外一个对象

      类的所有实例共享一个原型对象
    */
    constructor(x, y) {
      this.x = 1;
      this.y = 4;
    }
    AXB() {
      return this.x + "Arthas" + this.y;
    }
  }
  let c = new Pointa(3, 2).AXB(); // 1Arthas4

  /*
    取值函数getter&存值函数setter

    在类的内部也可以使用get set 这两个关键字，对某个属性设置存值函数也取值函数，拦截该属性的存取行为
  */

  class classa {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    get a() {
      return "this is get";
    }
    set a(v) {
      // console.log("set:" + v);
    }
  }
  let d = new classa();

  d.a = 123;

  // console.log(d.a) -> set:123  this is get

  /*
    name属性
      总是返回class关键词后的类名
    class point {}
    point.name -> point
    
    this 指向
      类的方法内部如果含有this，默认指向类的实例
    
    静态方法
      在一个方法前，加上 static 关键字，就表示该方法不会被实例继承，而是直接通过类来调用

    class Foo{
      static classMethod() {
        return 'hello'
      }
      static a() {
        return this.b()
      }
      a(){
        return 'jia a'
      }
      b(){
        return 'aaa'
      }
    }
    Foo.classMehtod() -> 'hello'

    let foo = new Foo()
    foo.classMethod() -> 报错，表示不存在该方法

    静态方法中如果包含this，这个this指的是类，而不是实例
    静态方法可以和非静态方法重名

    Foo.a() -> 'aaa'

   */

  // 实例属性除了定义在this上面，也可以定义在最顶层

  class classb {
    b = "woshi b";
    constructor() {
      this.a = "woshi a";
    }
    aa() {
      // console.log(this.a, this.b);
    }
  }
  let f = new classb();
  f.aa(); // 'woshi a', 'woshi b'

  /*
      类的静态属性

    旧写法
    class Foo{
      // some code...
    }
    
    Foo.a = 1

    Foo.a -> 1

    新写法

    class Foo{
      static a = 1
    }

    Foo.a -> 1

    新写法是显式声明，语义更好
    */

  return null;
}

function InheritBox() {
  /*
  ES6 可以通过extends关键字来实现继承
  
  super()在这里表示父类的构造函数，用来新建父类的this对象
  子类必须在constructor方法中调用super方法，不然会报错

  在子类的构造函数中，只有调用super后，才能使用this 不然会报错
  */
  class Point {
    constructor(x, y) {
      this.x = x * 2;
      this.y = y * 2;
    }
  }
  class PiontChildrenBox extends Point {
    constructor(x, y, color) {
      super(x, y); // 调用父类的constructor(x,y)
      this.color = color;
    }
    toString() {
      return this.color + " " + super.toString(); // 调用父类的toString()
    }
  }
  let g = new Point(3, 4); // x:6,y:8
  let h = new PiontChildrenBox(1, 2, "green"); // x:2, y:4, color: 'green'

  /*
    super
      super这个关键字，既可以当函数使用，也可以当对象使用，两种情况下，它的作用完全不同

      当super作为函数时，代表父类的构造函数，子类的构造函数必须执行一次super，不然会报错
      作为函数时，super只能用在子类的构造函数中，其他地方都会报错
  
  */

  /*
    继承 extends http://www.imooc.com/article/79235
  */
  return null;
}

function ModelBox() {
  /*
    Go model.js
  */
  model()
  models();
  // a -> 123
  // Arthas -> 456
  // exdef()


  /*
    跨模块常量

      常量文件夹.js
      export const a = 123

      模块1
      // export * 表示再输出 '跨模块常量.js' 的所有属性和方法  相当于继承
      export * as constBox from '跨模块常量.js'
      constBox.a -> 123

      模块2
      export {a} from '跨模块常量.js'
      a -> 123

    如果需要使用的常量很多，也可以专门开设一个js文件放置这些常量

  */

  /*
    import()  支持动态加载模块

    它可以放置到任何地方，只要代码运行到这里才会开始加载
  
  
  */

  setTimeout(() => {
    // 执行时返回一个Promise对象，成功后内部有导出的整个模块
    import('./model.js').then(res=>{
      // res.default() 指向默认导出 -> export()
      // res.a -> 123
    })

    // 也可以通过解构赋值的方式来直接拿到导出变量
    import('./model.js').then(({a, Arthas})=>{
      // a, Arthas -> 123, 456
    })
    
  }, 3000);
  return null;
}
export default Box;
