let  { SyncWaterfallHook } = require('tapable')

/*
  SyncWaterfallHook 瀑布钩子上一个钩子的返回值会传递到下一个钩子的第二个参数的函数参数中
*/

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncWaterfallHook(['Arthas'])
    }
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tap('vue', function(name){
      console.log('vue', name);
      return 'Aaaaaa i am'
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