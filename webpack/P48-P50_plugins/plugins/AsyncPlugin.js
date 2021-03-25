class AsyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('AsyncPlugin', (compliation, cb) => {
      setTimeout(() => {
        console.log('async 发射成功～～～');
        cb()
      }, 1 * 1000);
    })
    compiler.hooks.emit.tapPromise('AsyncPlugin', (compliation) => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('promise 发射成功～～～');
          resolve()
        }, 1 * 1000);
      })
    })
  }
}
module.exports = AsyncPlugin