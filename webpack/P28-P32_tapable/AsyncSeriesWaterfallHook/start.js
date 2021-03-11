let { AsyncSeriesWaterfallHook } = require('tapable')

/*
  AsyncSeriesWaterfallHook 是一个异步串联钩子
*/

class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncSeriesWaterfallHook(['Arthas'])
    }
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tapAsync('vue', (name, cb) => {
      setTimeout(() => {
        console.log('vue', name);
        cb(undefined, 'Arthas')
      }, 1000);
    })
    this.hooks.arch.tapAsync('react', (name, cb) => {
      setTimeout(() => {
        console.log('react', name);
        cb()
      }, 1000);
    })
    this.hooks.arch.tapAsync('webpack', (name, cb) => {
      setTimeout(() => {
        console.log('webpack', name);
        cb()
      }, 1000);
    })
  }
  // 执行
  start() {
    this.hooks.arch.callAsync('Aa', function () {
      console.log('end');
    })
  }
}

let a = new Lesson()

a.tap()
a.start()