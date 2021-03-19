const path = require('path')
const fs = require('fs')
const babylon = require('babylon') // 转换成ast语法
const type = require('@babel/types') // 替换结果
const traverse = require('@babel/traverse').default // 遍历节点
const generator = require('@babel/generator').default // 生成替换结果
const ejs = require('ejs')

class Compiler {
  constructor(config) {
    this.config = config
    this.entry = config.entry
    this.entryId = '' // 入口id
    this.modules = {} // 存放解析好的内容
    this.root = process.cwd() // 绝对工作路径
  }
  // 解析
  getSource(modulePath) {
    // 通过fs解析拿到utf-8的源码
    let content = fs.readFileSync(modulePath, 'utf8')
    let rules = this.config.module.rules
    for (let i in rules) {
      let rule = rules[i]
      let { test, use } = rule
      let len = use.length - 1
      if (test.test(modulePath)) {
        function normalLoader() {
          let loader = require(use[len--])
          content = loader(content)
          if(len >= 0) normalLoader()
        }
        normalLoader()
      }
    }
    return content
  }
  //  模块打包  参数一为模块的完整路径 二为是否为主模块
  buildModule(modulePath, isEntry) {
    // 1. 拿到源码
    let source = this.getSource(modulePath)
    // 2. 通过路径的相减拿到模块名称 './src/index.js'
    let moduleName = './' + path.relative(this.root, modulePath)
    // 如果当然为主模块赋值给entryId
    if (isEntry) this.entryId = moduleName
    // 3. 对当前源码进行ast语法解析，拿到二次更正后的内容
    let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName))
    this.modules[moduleName] = sourceCode
  }
  // 解析源码 参数一 源码  参数二 父路径
  parse(source, parentPath) {
    // 3.1 将源码解析成ast
    let ast = babylon.parse(source)
    // 依赖的数组
    let dependencies = []
    // 3.2 对ast进行解析
    traverse(ast, {
      // 调用表达式
      CallExpression(p) { // p为当前节点
        // 拿到当前节点
        let node = p.node
        // https://astexplorer.net/
        // 判断是否是require语法
        if (node.callee.name === 'require') {
          // 修改成自己的名字
          node.callee.name = '__webpack_require__'
          // 拿到当前节点的名字
          let moduleName = node.arguments[0].value
          // 校验是否有后缀，无则添加
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js')
          // 将路径补全
          moduleName = './' + path.join(parentPath, moduleName)
          dependencies.push(moduleName)
          // 修改节点
          node.arguments = [type.stringLiteral(moduleName)]
        }
      }
    })
    // 3.3 生成二次修改后的源码
    let sourceCode = generator(ast).code
    // 3.4 遍历对子项进行构建
    dependencies.forEach(dep => this.buildModule(path.join(this.root, dep), false))
    // 3.5 返回更正后的源码与依赖数组
    return { sourceCode, dependencies }
  }
  // 发射文件
  emitFile() {
    // 拿到发射路径
    let main = path.join(this.config.output.path, this.config.output.filename)
    // 拿到ejs模版内容
    let templateStr = this.getSource(path.resolve(__dirname, 'template.ejs'))
    // 通过ejs进行渲染，拿到成品
    let code = ejs.render(templateStr, { entryId: this.entryId, modules: this.modules })
    // 用于多页面
    this.asstes = {}
    this.asstes[main] = code
    // 在指定目录中编写文件 -done
    fs.writeFileSync(main, this.asstes[main])
  }
  run() {
    // 开始构建模块
    this.buildModule(path.resolve(this.root, this.entry), true)
    // console.log(this.modules, this.entryId);
    // 将构建好的文件发射出去
    this.emitFile()
  }
}

module.exports = Compiler