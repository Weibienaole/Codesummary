import pluginMdx from '@mdx-js/rollup'
import type { Plugin } from 'vite'
// remark规范模块
import remarkPluginGFM from 'remark-gfm'
// 添加#锚点模块
import rehypePluginAutolinkHeaderings from 'rehype-autolink-headings'
import rehypePluginSlug from 'rehype-slug'
// 解析页面元信息
import remarkPluginFrontmatter from 'remark-frontmatter'
import remarkPluginMDXFrontmatter from 'remark-mdx-frontmatter'

export function pluginMdxRollup(): Plugin {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGFM,
      remarkPluginFrontmatter,
      [remarkPluginMDXFrontmatter, { name: 'frontmatter' }]
    ],
    rehypePlugins: [
      rehypePluginSlug,
      [
        rehypePluginAutolinkHeaderings,
        {
          properties: {
            class: 'header-anchor'
          },
          content: {
            type: 'text',
            value: '#'
          }
        }
      ]
    ]
  })
}
