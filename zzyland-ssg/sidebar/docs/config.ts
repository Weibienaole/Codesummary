import { defineConfig } from '../dist'

export default defineConfig({
  title: 'zIsland.js',
  themeConfig: {
    nav: [
      {
        title: '主页',
        link: '/'
      },
      {
        title: '指南',
        link: '/'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '教程',
          items: [
            {
              text: '快速上手',
              link: '/guide/a'
            },
            {
              text: '如何安装',
              link: '/guide/b'
            }
          ]
        }
      ]
    }
  }
})

