class AsyncSeriesWaterfallHook {
  // 手动实现
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tapAsync(name, fn) {
    this.tasks.push(fn)
  }
  callAsync(...args) {
    let lastFn = args.pop()
    let index = 0
    let next = (err, data) => {
      let task = this.tasks[index]
      if (!task || err) return lastFn()
      index === 0 ? task(...args, next) : task(data, next)
      index++
    }
    next()
  }
}
let a = new AsyncSeriesWaterfallHook()
a.tapAsync('vue', function (data, cb) {
  setTimeout(() => {
    console.log('vue', data);
    cb('undefined', 'Arthas')
  }, 1000);
})
a.tapAsync('react', function (data, cb) {
  setTimeout(() => {
    console.log('react', data);
    cb(undefined, 'Monica')
  }, 1000);
})
a.tapAsync('webpack', function (data, cb) {
  setTimeout(() => {
    console.log('webpack', data);
    cb()
  }, 1000);
})

a.callAsync('Aa', () => {
  console.log('end');
})