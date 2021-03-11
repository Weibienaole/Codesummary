
class AsyncParallelPromiseHook {
  // 手动实现
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tapPromise(name, fn) {
    this.tasks.push(fn)
  }
  promise(...args) {
    let [first, ...other] = this.tasks
    return other.reduce((pro, next) => pro.then(() => next(...args)), first(...args))
  }
}
let a = new AsyncParallelPromiseHook()
a.tapPromise('vue', data => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('vue', data);
      resolve()
    }, 1000);
  })
})
a.tapPromise('react', data => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('react', data);
      resolve()
    }, 1000);
  })
})

a.promise('Aa').then(() => {
  console.log('end');
})