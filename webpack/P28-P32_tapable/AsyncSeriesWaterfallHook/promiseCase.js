
class AsyncParallelPromiseHook {
  // 手动实现
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tapPromise(name, fn) {
    this.tasks.push(fn)
  }
  promise(...args) {
    let [first, ...others] = this.tasks
    return others.reduce((pre, cur) => {
      return pre.then(res => cur(res))
    }, first(...args))
  }
}
let a = new AsyncParallelPromiseHook()
a.tapPromise('vue', data => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('vue', data);
      resolve('Arthas')
    }, 1000);
  })
})
a.tapPromise('react', data => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('react', data);
      resolve('Woo')
    }, 1000);
  })
})
a.tapPromise('webapck', data => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('webapck', data);
      resolve('Woos')
    }, 1000);
  })
})

a.promise('Aa').then(() => {
  console.log('end');
})