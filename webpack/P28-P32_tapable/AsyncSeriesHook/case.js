class AsyncSeriesHook {
  // 手动实现
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tapAsync(name, fn) {
    this.tasks.push(fn)
  }
  callAsync(...args) {
    let lastFn = args.pop()
    let index = 0, res
    let next = () => {
      if(index === this.tasks.length)return lastFn()
      res = this.tasks[index++](...args, next)
    }
    next()
  }
}
let a = new AsyncSeriesHook()
a.tapAsync('vue', function (data, cb) {
  setTimeout(() => {
    console.log('vue', data);
    cb()
  }, 2000);
})
a.tapAsync('react', function (data, cb) {
  setTimeout(() => {
    console.log('react', data);
    cb()
  }, 1000);
})

a.callAsync('Aa', () => {
  console.log('end');
})