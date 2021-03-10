class SyncWaterfallHook {
  // 手动实现
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tap(name, fn) {
    this.tasks.push(fn)
  }
  call(...args) {
    let [first, ...others] = this.tasks
    let res = first(...args)
    others.reduce((all, next) => next(all), res)
  }
}
let a = new SyncWaterfallHook()
a.tap('vue', function (data) {
  console.log('vue', data);
  return 'vue oook'
})
a.tap('react', function (data) {
  console.log('react', data);
  return 'react ooook!'
})
a.tap('node', function (data) {
  console.log('node', data);
  return 'node ok'
})

a.call('Aa')