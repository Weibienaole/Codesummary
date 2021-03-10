let  { SyncHook } = require('tapable')

/*
  SyncHook 是一个同步钩子，将监听到的函数依次执行。
*/

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncHook(['Arthas'])
    }
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tap('vue', function(data){
      console.log('vue', data);
    })
    this.hooks.arch.tap('react', function(data){
      console.log('react', data);
    })
  }
  // 执行
  start() {
    this.hooks.arch.call('Aa')
  }
}

let a = new Lesson()

a.tap()
a.start()