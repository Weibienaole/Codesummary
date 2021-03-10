class SyncHook {
  constructor() {
    this.tasks = []
  }
  tap(name, fn) {
    this.tasks.push(fn)
  }
  start(...args) {
    this.tasks.forEach(task => task(...args))
  }
}

// let a = new SyncHook()
// a.tap('vue', name => {
//   console.log('vue', name);
// })
// a.tap('react', name => {
//   console.log('react', name);
// })
// a.start('Arthas')

class SyncBailHook {
  constructor() {
    this.tasks = []
  }
  tap(name, fn) {
    this.tasks.push(fn)
  }
  start(...args) {
    let res, index = 0
    do {
      res = this.tasks[index++](...args)
    } while (res === undefined && index < this.tasks.length)
  }
}


// let a = new SyncBailHook()
// a.tap('vue', name => {
//   console.log('vue', name);
//   return undefined
// })
// a.tap('react', name => {
//   console.log('react', name);
// })
// a.start('Arthas')


class SyncWaterfallHook {
  constructor() {
    this.tasks = []
  }
  tap(name, fn) {
    this.tasks.push(fn)
  }
  start(...args) {
    let [first, ...others] = this.tasks
    let res = first(...args)
    others.reduce((all, next) => next(all), res)
  }
}

// let a = new SyncWaterfallHook()
// a.tap('vue', name => {
//   console.log('vue', name);
//   return 'vue ook'
// })
// a.tap('react', data => {
//   console.log('react', data);
//   return 'react oooooook'
// })
// a.tap('node', data => {
//   console.log('node', data);
//   return 'node ok'
// })
// a.start('Arthas')

class SyncLoopHook {
  constructor() {
    this.tasks = []
  }
  tap(name, fn) {
    this.tasks.push(fn)
  }
  start(...args) {
    this.tasks.forEach(task => {
      let res
      do{
        res = task(...args)
      }while(res !== undefined)
    })
  }
}
let idx = 0
let a = new SyncLoopHook()
a.tap('vue', name => {
  console.log('vue', name);
})
a.tap('react', name => {
  console.log('react', name);
  return ++idx === 3 ? undefined : 'react oooooook'
})
a.tap('node', name => {
  console.log('node', name);
})
a.start('Arthas')