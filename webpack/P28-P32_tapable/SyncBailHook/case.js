class SyncBailHook {
  // 手动实现
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tap(name, fn) {
    this.tasks.push(fn)
  }
  call(...args) {
    let index = 0,
    res
    do{
      res = this.tasks[index++](...args)
    }while(res === undefined && index < this.tasks.length)
  }
}
let a = new SyncBailHook()
a.tap('vue', function (data) {
  console.log('vue', data);
  return undefined
})
a.tap('react', function (data) {
  console.log('react', data);
  return 'stop!'
})
a.tap('node', function (data) {
  console.log('node', data);
})

a.call('Aa')