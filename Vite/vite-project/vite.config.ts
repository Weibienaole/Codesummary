import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import autoprefixer from 'autoprefixer'
import viteEslint from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'
import viteImagemin from 'vite-plugin-imagemin'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import fs from 'fs'

// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve('./src/variable.less'))

const isProduction = process.env.NODE_ENV === 'production'
console.log(process.env.NODE_ENV, ' process.env.NODE_ENV')

const BASE_URL = 'https://juejin.cn/'

const esbuildPatchPlugin = {
  name: 'react-virtualized-patch',
  setup(build) {
    build.onLoad(
      {
        filter:
          /react-virtualized\/dist\/es\/WindowScroller\/utils\/onScroll.js$/
      },
      async (args) => {
        const text = await fs.promises.readFile(args.path, 'utf8')

        return {
          contents: text.replace(
            'import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";',
            ''
          )
        }
      }
    )
  }
}

export default defineConfig({
  mode: 'development',
  // 手动指定根目录位置
  root: path.join(__dirname, 'src'),
  resolve: {
    // 别名配置
    alias: {
      '/@assets': path.join(__dirname, 'src/assets')
    }
  },
  // base: isProduction ? BASE_URL : '/',
  plugins: [
    react(),
    viteEslint(), // 加入eslint
    svgr(), // SVG 组件方式加载 插件
    // 图片压缩
    viteImagemin({
      // 无损压缩配置
      optipng: {
        optimizationLevel: 7
      },
      // 有损压缩配置，可能会变差
      pngquant: {
        quality: [0.8, 0.9]
      },
      // svg优化
      svgo: {
        plugins: [
          {
            name: 'removeViteBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    }),
    createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, 'src/assets/icons')]
    })
  ],
  build: {
    // 转化为base64的界限
    assetsInlineLimit: 4 * 1024
  },
  // css相关配置
  css: {
    modules: {
      // 通过此属性对css module命名进行自定义
      // name 表示当前文件名，local 表示类名
      generateScopedName: '[name]__[local]__[hash:base64:5]'
    },
    preprocessorOptions: {
      // 这里改成你用的预编译处理器 less/sass/stylus
      less: {
        // 注意加入引号以及分号
        additionalData: [`@import "${variablePath}";`]
      }
    },
    // postcss 配置
    postcss: {
      plugins: [
        autoprefixer({
          // 设置浏览器范围
          overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
        })
      ]
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildPatchPlugin]
    }
  }
})
