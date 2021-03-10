let  { SyncBailHook } = require('tapable')

/*
  SyncBailHook 是一个同步,具有保险，熔断的钩子。
  监听函数内如果返回非 undefine 的值就会停止执行
*/

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncBailHook(['Arthas'])
    }
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tap('vue', function(data){
      console.log('vue', data);
      return 'stop'
    })
    this.hooks.arch.tap('react', function(data){
      console.log('react', data);
      return undefined
    })
    this.hooks.arch.tap('node', function(data){
      console.log('node', data);
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