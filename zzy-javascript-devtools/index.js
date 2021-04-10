const RegModules = require('./lib/regModule.min')
const DevTools = require('./lib/devTools.min')
const ReactComponents = require('./lib/reactComponents/index.min')

// html引入 import 方式替换require处理
// import DevTools from './src/devTools'
// ...

let devtools = new DevTools()
let regModules = new RegModules()

// html引入
// export default { devtools }
module.exports = { devtools, regModules, ReactComponents }
// export default 


// react 通过babel单独转译,转译之后引入index.js 整体导出