const { build } = require('esbuild')
/*
  插件为一个对象，有两个参数 分别是name 插件名称  setup 执行函数
    setup函数中有一个build参数，用来提供钩子
  插件中的钩子
    onResolve 控制路径解析
    onLoad 模块内容加载
      这两个钩子都接受两个参数 options 和 callback.
        options为一个对象，含有 filter 和 namespace
        类型定义：
          interface Options {
            filter: RegExp;
            namespace?: string;
          }
        一般在 onResolve 中 return 出的 namespace 和 onLoad 的 options 中传入的 namespace 相对应，就是直接使用namespace将指定文件过滤出来
    onStart 每次 build 的时候，包括触发 watch 或者 serve模式下的重新构建时执行
    onEnd 打包结束时执行 onEnd 钩子中如果要拿到 metafile，必须将 Esbuild 的构建配置中metafile属性设为 true。
*/

// callback
// onResolve中函数参数以及返回参数：
build.onResolve({ filter: /^env$/ }, (args: onResolveArgs): onResolveResult => {
  // 模块路径
  console.log(args.path)
  // 父模块路径
  console.log(args.importer)
  // namespace 标识
  console.log(args.namespace)
  // 基准路径
  console.log(args.resolveDir)
  // 导入方式，如 import、require
  console.log(args.kind)
  // 额外绑定的插件数据
  console.log(args.pluginData)
  
  return {
    // 错误信息
    errors: [],
    // 是否需要 external
    external: false,
    // namespace 标识
    namespace: 'env-ns',
    // 模块路径
    path: args.path,
    // 额外绑定的插件数据
    pluginData: null,
    // 插件名称
    pluginName: 'xxx',
    // 设置为 false，如果模块没有被用到，模块代码将会在产物中会删除。否则不会这么做
    sideEffects: false,
    // 添加一些路径后缀，如`?xxx`
    suffix: '?xxx',
    // 警告信息
    warnings: [],
    // 仅仅在 Esbuild 开启 watch 模式下生效
    // 告诉 Esbuild 需要额外监听哪些文件/目录的变化
    watchDirs: [],
    watchFiles: []
  }
}

// onLoad中函数参数以及返回参数：
build.onLoad({ filter: /.*/, namespace: 'env-ns' }, (args: OnLoadArgs): OnLoadResult => {
  // 模块路径
  console.log(args.path)
  // namespace 标识
  console.log(args.namespace)
  // 后缀信息
  console.log(args.suffix)
  // 额外的插件数据
  console.log(args.pluginData)
  
  return {
      // 模块具体内容
      contents: '省略内容',
      // 错误信息
      errors: [],
      // 指定 loader，如`js`、`ts`、`jsx`、`tsx`、`json`等等
      loader: 'json',
      // 额外的插件数据
      pluginData: null,
      // 插件名称
      pluginName: 'xxx',
      // 基准路径
      resolveDir: './dir',
      // 警告信息
      warnings: [],
      // 同上
      watchDirs: [],
      watchFiles: []
  }
})

/*
let examplePlugin = {
  name: 'example',
  setup(build) {
    build.onStart(() => {
      console.log('build started')
    });
    build.onEnd((buildResult) => {
      if (buildResult.errors.length) {
        return;
      }
      // 构建元信息
      // 获取元信息后做一些自定义的事情，比如生成 HTML
      console.log(buildResult.metafile)
    })
  },
}
*/
