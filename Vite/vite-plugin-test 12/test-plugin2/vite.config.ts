import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import virtual from './plugins/virtualModule'
import svgr from './plugins/svgrComponent'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), virtual(), svgr({ defaultExport: 'url' })]
})
