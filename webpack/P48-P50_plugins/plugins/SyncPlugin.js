class SyncPlugin{
  // 在webpack的 Compiler.js 中只要配置中存在 plugins 就会循环调用每一个插件中的 apply()方法 可以当作启动插件的方法。
  // 调用apply方法会传入compiler.js中的this
  apply(compiler){
    // 内部有多个hooks作为生命周期来使用，stats 为tap回调传入的参数
    // hooks可以在 node_modules -> webpack -> lib -> Compiler.js 文件中找到所有设定的 hooks (详见tapable)
    compiler.hooks.done.tap('SyncPlugin', (stats)=>{
      console.log('同步编译完成～～');
    })
  }
}
module.exports = SyncPlugin