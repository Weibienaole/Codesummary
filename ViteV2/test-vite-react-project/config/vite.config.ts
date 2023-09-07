import { join, resolve } from 'path'
import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import viteEslint from 'vite-plugin-eslint' // eslint
import svgr from 'vite-plugin-svgr' // svg组件化
import viteImagemin from 'vite-plugin-imagemin' // 图片类型压缩
import { visualizer } from 'rollup-plugin-visualizer' // 打包体积分析

const transformNormalizePath = (fn, ...val) => {
	return normalizePath(fn(...val))
}

export default defineConfig(({ command, mode }) => {
	const isDev = mode === 'development'
	return {
		mode,
		plugins: [
			react({
				// babel: {
				// 	plugins: [
				// 		// 适配 styled-component
				// 		'babel-plugin-styled-components'
				// 	]
				// }
			}),
			viteEslint(),
			svgr(),
			isDev ? devPlugins() : prodPlugins()
		],
		envDir: transformNormalizePath(resolve, __dirname, './'), // .env 文件的位置
		resolve: {
			alias: {
				// '@': transformNormalizePath(join, __dirname, '../src')
				'@': '../src'
			}
		},
		optimizeDeps: {
			// 强制进行预构建
			include: ['react', 'react-dom']
		},
		publicDir: transformNormalizePath(join, __dirname, '../public'),
		build: {
			// target: 'es2020',
			// sourcemap: false,
			// assetsInlineLimit: 4096, //小于此阈值 kb 的导入或引用资源将内联为 base64 编码
			rollupOptions: {
				external: ['@/utils/index.ts'],
				...(!isDev && prodBuildConfig())
			}
		}
	}
})

const devPlugins = () => []
const prodPlugins = () => [
	viteImagemin({
		// 无损压缩配置，无损压缩下图片质量不会变差
		optipng: {
			optimizationLevel: 7
		},
		// 有损压缩配置，有损压缩下图片质量可能会变差
		pngquant: {
			quality: [0.8, 0.9]
		}
	}),
	visualizer({ open: true })
]

const prodBuildConfig = () => ({
	output: {
		chunkFileNames: 'js/chunk_[name]-[hash].js', // 引入文件名的名称
		entryFileNames: 'js/entry_[name]-[hash].js', // 包的入口文件名称
		assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
		manualChunks(id) {
			// 将每一个node_modules分包
			if (id.includes('node_modules')) {
				return 'vendor'
			}
		}
	}
})
