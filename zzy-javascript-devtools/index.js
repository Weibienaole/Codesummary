const RegModules = require('./src/regModule')
const DevTools = require('./src/devTools')
// const {ReactComponents} = require('./src/reactComponets')

// html引入 import 方式替换require处理
// import DevTools from './src/devTools'
// ...

let devtools = new DevTools()
let regModules = new RegModules()

// console.log(ReactComponents, 'ReactComponents');

// html引入
// export default { devtools }
module.exports = { devtools, regModules }
// export default 


// react 通过babel单独转译,转译之后引入index.js 整体导出