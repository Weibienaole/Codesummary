let  { SyncLoopHook } = require('tapable')

/*
  SyncLoopHook 循环钩子 如果某一个函数具有返回值，便一直循环直至返回值为 undefined 为止
*/

class Lesson {
  constructor() {
    this.index = 0
    this.hooks = {
      arch: new SyncLoopHook(['Arthas'])
    }
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tap('vue', (name) => {
      console.log('vue', name);
      return ++this.index === 3 ? undefined : 'then'
    })
    this.hooks.arch.tap('react', (data) => {
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