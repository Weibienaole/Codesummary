import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import viteTestPlugin from './vitePlugin/test-hooks-plugin'
import virtualCode from './vitePlugin/virtual'
// import loadSvgr from './vitePlugin/loadSvg'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), virtualCode()],
})
