class SyncHook {
  // 手动实现
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tap(name, fn) {
    this.tasks.push(fn)
  }
  call(...args) {
    this.tasks.forEach(task => task(...args))
  }
}
let a = new SyncHook()
a.tap('vue', function (data) {
  console.log('vue', data);
})
a.tap('react', function (data) {
  console.log('react', data);
})

a.call('Aa')