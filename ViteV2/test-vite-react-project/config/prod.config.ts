import { defineConfig } from 'vite'
import viteImagemin from 'vite-plugin-imagemin' // 图片类型压缩
import { visualizer } from 'rollup-plugin-visualizer' // 打包体积分析

export default defineConfig(({ command }) => {
	const isServe = command === 'serve'
	return {
		build: {
			sourcemap: false,
			rollupOptions: !isServe
				? {
						output: {
							chunkFileNames: 'assets/js/chunk_[name]-[hash:6].js', // 引入文件名的名称
							entryFileNames: 'assets/js/entry_[name]-[hash:6].js', // 包的入口文件名称
							assetFileNames: 'assets/[ext]/[name]-[hash:6].[ext]', // 资源文件像 字体，图片等
							manualChunks(id) {
								// 将每一个node_modules分包
								if (id.includes('node_modules')) {
									return 'vendor'
								}
							}
						}
				  }
				: {}
		},
		plugins: [
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
	}
})
