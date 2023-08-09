import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/node/cli.ts', './src/node/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  bundle: true,
  splitting: true,
  outDir: 'dist',
  shims: true, // 对esm和cjs的变量做兼容处理
  clean: true
})
