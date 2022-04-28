const path = require('path')
/**
 * 可以使用vscode的类型提示
 * @type { import('rollup').RollupOptions }
 */

const buildOptions = {
  // 入口
  // input: ['./src/index.js'],
  // 多入口
  // input: ['./src/index.js', './src/util.js'],
  // 或者
  input: {
    index: 'src/index.js',
    utils: 'src/util.js'
  },

  // 输出
  // output: {
  //   // 目标
  //   dir: 'dist/es',
  //   // 格式
  //   format: 'esm'
  // }
  // 多产物配置
  output: [
    {
      dir: 'dist/es',
      format: 'esm'
    },
    {
      dir: 'dist/cjs',
      format: 'cjs'
    }
  ]
}

// export default buildOptions

// 复杂环境下，分别打包
/**
 * @type { import('rollup').RollupOptions }
 */
const buildUtilOptions = {
  input: ["src/util.js"],
  output: [
    // 省略 output 配置
  ],
};

/**
 * @type { import('rollup').RollupOptions }
 */
const buildIndexOptions = {
  input: ["src/index.js"],
  // 自定义output配置
  output: {
    // 产物输出目录
    dir: path.resolve(__dirname, 'dist'),
    /* 
      占位符集合
      [name] 文件名称
      [hash] hash
      [format] 编译格式
      [extname] 产物后缀名 包括 .
    */
    // 入口文件输出名称
    entryFileNames: '[name].js',
    chunkFileNames: 'chunk_[name].js',
    assetFileNames: 'assets/[name]_[hash][extname]',
    // 产物输出格式 包括 cjs es amd iife umd system
    format: 'es',
    // 是否生成soucemap文件
    sourcemap: true,
    // 如果使用 umd/iife 格式 需要对外提供一个全局变量，通过name配置
    name: 'MyBoundle',
    // 全局变量声明
    globals: {
      // 将jquery替换成 $
      jquery: '$'
    }
  },
  // 不将此内容打包进去
  external: ['react', 'react-dom']
}

// export default [buildIndexOptions, buildUtilOptions]

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser';

const buildOptions2 = {
  input: 'src/index.js',
  output: [
    {
      plugins: [terser()],
      dir: "dist/es",
      format: "esm",
    },
    {
      dir: "dist/cjs",
      format: "cjs",
    },
  ],
  plugins: [resolve(), commonjs()]
}
export default buildOptions2