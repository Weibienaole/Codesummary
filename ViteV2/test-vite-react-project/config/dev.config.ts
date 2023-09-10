import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
	const isServe = command === 'serve'
	return {
		build: {
			sourcemap: true
		},
		plugins: []
	}
})
