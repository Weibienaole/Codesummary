module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    // prettier的eslint插件
    'prettier',
    'plugin:prettier/recommended'
  ],
  globals:{
    // 全局变量声明
    // '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__': false
    /*
      "writable"或者 true，表示变量可重写；
      "readonly"或者false，表示变量不可重写；
      "off"，表示禁用该全局变量。
     */
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures:{
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react-refresh', '@typescript-eslint', 'react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // 使用any类型
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': 'error', // 开启 prettier 自动修复的功能
    quotes: ['error', 'single'], // 单引号
    semi: ['error', 'never'], // 结尾不追加分号
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/react-in-jsx-scope': 'off', // 解决 jsx文件内 不引入 React from ‘react’ 的报错
    '@typescript-eslint/no-var-requires': 0, // 解决require部分没有通过import引入
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
