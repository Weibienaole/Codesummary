module.exports = {
  // 运行环境
  env: {
    node: true,
    browser: true,
    commonjs: true,
    amd: true,
    es2021: true
  },
  /*
  继承另外一份的配置，分三种情况
  1.从ESLint本身继承
  2.从npm插件中继承 eslint-config-xxx  配置时可以省略eslint-config
  3.从ESLint插件中继承 可以省略 eslint-plugin 格式一般为: `plugin:${pluginName}/${configName}`
  */

  extends: [
    // 第一种
    'eslint:recommended',
    // 第二种
    'prettier',
    // 第三种
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser', // 解析器 通过特定解析器，来兼容ts语法
  // 解析器选项
  parserOptions: {
    // 使用额外的语言特性
    ecmaFeatures: {
      jsx: true
    },
    // 配置es版本 latest 是最新的
    ecmaVersion: 'latest',
    // 默认script  module为使用ES Module
    sourceType: 'module'
  },
  // 通过插件可以添加一些特定的规则，但是默认不会直接添加，需要手动在rules中添加配置
  plugins: [
    'react',
    // 添加ts规则
    '@typescript-eslint',
    'prettier'
  ],
  /*
  具体规则
    key 为规则名称 value 为配置内容接受数组或者字符串 数组的话，第一项为规则id，第二项为配置 
    规则id：off/0 为关闭规则  warn/1 为开启，但只是抛出warning 不会停止运行 error/3 为开始 会抛出error，会停止运行
    规则配置根据不同规则而定 详情：https://cn.eslint.org/docs/rules/
  */
  rules: {
    // 控制缩进
    indent: ['warn', 2],
    // 一致的换行
    'linebreak-style': ['warn', 'unix'],
    // 一致的引号
    quotes: ['warn', 'single'],
    // 分号设置
    semi: ['warn', 'never'],
    // plugins中相应的特殊配置
    'prettier/prettier': 'warn', // 开启 prettier 自动修复的功能
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': ['off']
  }
}
