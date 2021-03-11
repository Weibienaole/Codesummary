let { AsyncParallelHook } = require('tapable')

/*
  AsyncParallelHook 是一个异步并联钩子
*/

class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncParallelHook(['Arthas'])
    }
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tapAsync('vue', (name, cb) => {
      setTimeout(() => {
        console.log('vue', name);
        cb()
      }, 1000);
    })
    this.hooks.arch.tapAsync('react', (name, cb) => {
      setTimeout(() => {
        console.log('react', name);
        cb()
      }, 1000);
    })
  }
  // 执行
  start() {
    this.hooks.arch.callAsync('Aa', function(){
      console.log('end');
    })
  }
}

let a = new Lesson()

a.tap()
a.start()