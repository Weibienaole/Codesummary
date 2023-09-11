import { join, resolve } from 'path'
import {
	defineConfig,
	normalizePath,
	mergeConfig,
	UserConfig,
	loadEnv
} from 'vite'
import react from '@vitejs/plugin-react'
import viteEslint from 'vite-plugin-eslint' // eslint
import svgr from 'vite-plugin-svgr' // svg组件化
import autoprefixer from 'autoprefixer'

import prodConfig from './config/prod.config'
import devConfig from './config/dev.config'

const transformNormalizePath = (fn, ...val) => {
	return normalizePath(fn(...val))
}

export default defineConfig((props) => {
	const { mode } = props
	const isProd = mode === 'production'
	const root = process.cwd()
	const env = loadEnv(mode, root)
	const baseConfig: UserConfig = {
		root,
		mode,
		base: '',
		envDir: transformNormalizePath(resolve, __dirname, './config'), // .env 文件的位置
		resolve: {
			alias: {
				'@': transformNormalizePath(join, __dirname, './src')
			}
		},
		publicDir: transformNormalizePath(join, __dirname, './public'),
		server: {
			port: 8000
		},
		css: {
			postcss: {
				plugins: [
					autoprefixer({
						overrideBrowserslist: ['>1%', 'not dead'],
						grid: true
					})
				]
			}
		},
		optimizeDeps: {
			// 强制进行预构建
			include: ['react', 'react-dom']
		},
		build: {
			target: 'esnext',
			assetsInlineLimit: 4096, //小于此阈值 kb 的导入或引用资源将内联为 base64 编码
			reportCompressedSize: false // 禁用 gzip 压缩大小报告
		},
		preview: {
			port: 8040
		},
		plugins: [
			react({
				babel: {
					plugins: [
						// 适配 styled-component
						'babel-plugin-styled-components'
					]
				}
			}),
			viteEslint(),
			svgr()
		]
	}
	return mergeConfig(
		baseConfig,
		isProd ? prodConfig(props) : devConfig(props),
		false
	)
})
