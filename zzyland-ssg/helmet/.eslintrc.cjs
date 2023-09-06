module.exports = {
  extends:[
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures:{
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    '@typescript-eslint/no-non-null-assertion': 'off',
   'react/react-in-jsx-scope': 'off', // 解决 jsx文件内 不引入 React from ‘react’ 的报错
   '@typescript-eslint/no-var-requires': 0, // 解决require部分没有通过import引入
   'react/no-unknown-property': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}