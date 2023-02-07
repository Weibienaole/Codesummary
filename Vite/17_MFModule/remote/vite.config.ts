import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// 远程模块
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote_app',
      filename: 'remoteEntry.js',
      // 导出模块声明
      exposes: {
        './Button': './src/components/Button.jsx',
        './App': './src/page/App.tsx',
        './utils': './src/api/utils.js'
      },
      // 共享模块声明
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    target: 'esnext'
  }
})
