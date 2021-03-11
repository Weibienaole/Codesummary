let { AsyncSeriesWaterfallHook } = require('tapable')

// promise实现

class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncSeriesWaterfallHook(['Arthas'])
    }
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tapPromise('vue', name => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('vue', name);
          resolve('Arthas')
        }, 2000);
      })
    })
    this.hooks.arch.tapPromise('react', name => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('react', name);
          resolve('Monica')
        }, 1000);
      })
    })
    this.hooks.arch.tapPromise('webpack', name => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('webpack', name);
          resolve()
        }, 1000);
      })
    })
  }
  // 执行
  start() {
    this.hooks.arch.promise('Aa').then(res=>{
      console.log('end');
    })
  }
}

let a = new Lesson()

a.tap()
a.start()