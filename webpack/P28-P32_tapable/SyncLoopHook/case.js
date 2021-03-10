class SyncLoopHook {
  // 手动实现
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tap(name, fn) {
    this.tasks.push(fn)
  }
  call(...args) {
    let res
    this.tasks.forEach(task => {
      do{
        res = task(...args)
      }while(res !== undefined)
    })
  }
}
let a = new SyncLoopHook()
let idx = 0
a.tap('vue', function (data) {
  console.log('vue', data);
})
a.tap('react', function (data) {
  console.log('react', data);
  return ++idx === 3 ? undefined : 'react ooook!'
})
a.tap('node', function (data) {
  console.log('node', data);
})

a.call('Aa')