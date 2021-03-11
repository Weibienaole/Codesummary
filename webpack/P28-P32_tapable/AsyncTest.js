class AsyncParallelHook {
  constructor() {
    this.tasks = [];
  }
  tapAsync(name, fn) {
    this.tasks.push(fn);
  }
  callAsync(...args) {
      let latsFn = args.pop()
      let index = 0
      let next = () => {
          if(index === this.tasks.length) return latsFn()
          this.tasks[index++](...args, next)
      }
      next()
  }
}

const hook = new AsyncParallelHook();

hook.tapAsync("vue", (name, cb) => {
  setTimeout(() => {
    console.log("vue", name);
    cb();
  }, 1000);
});
hook.tapAsync("react", (name, cb) => {
  setTimeout(() => {
    console.log("react", name);
    cb();
  }, 2000);
});

hook.callAsync("Arthas", () => {
  console.log("end");
});
