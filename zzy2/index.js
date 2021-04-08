const RegModules = require('./lib/regModule')
const DevTools = require('./lib/devTools')
const {ScrollLoadingBar} = require('./lib/reactComponets')

// html引入 import 方式替换require处理
// import DevTools from './lib/devTools'
// ...

let devtools = new DevTools()
let regModules = new RegModules()

console.log(ScrollLoadingBar, 'ReactComponents');

// html引入
// export default { devtools }

module.exports = { devtools, regModules, ScrollLoadingBar }