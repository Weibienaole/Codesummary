import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
	const isServe = command === 'serve'
	return {
		server: {
			port: 8000
		},
		build: {
			sourcemap: true
		},
		plugins: []
	}
})
