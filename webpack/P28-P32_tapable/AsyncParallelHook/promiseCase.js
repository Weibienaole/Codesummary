
class AsyncParallelPromiseHook {
  // 手动实现
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tapPromise(name, fn) {
    this.tasks.push(fn)
  }
  promise(...args) {
    let pro = this.tasks.map(task => task(...args))
    return Promise.all(pro)
  }
}
let a = new AsyncParallelPromiseHook()
a.tapPromise('vue', data => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('vue', data);
      resolve()
    }, 2000);
  })
})
a.tapPromise('react', data => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('react', data);
      resolve()
    }, 2000);
  })
})

a.promise('Aa').then(() => {
  console.log('end');
})