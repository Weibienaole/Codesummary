import resolvePlugin from '@rollup/plugin-node-resolve'
import commonjsPlugin from '@rollup/plugin-commonjs'
/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  input: ['src/index.js', 'src/utils.js'],
  output: [
    {
      // 产物输出目录
      dir: 'dist/es',
      // 产物格式
      format: 'esm'
    },
    {
      dir: 'dist/cjs',
      format: 'commonjs'
    }
  ],
  plugins: [resolvePlugin(), commonjsPlugin()]
}

export default buildOptions
