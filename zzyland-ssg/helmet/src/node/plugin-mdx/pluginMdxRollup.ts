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
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper'
import { rehypePluginShiki } from './rehypePlugins/shiki'
import shiki from 'shiki'
import { remarkPluginTOC } from './remarkPlugins/toc'

export async function pluginMdxRollup(): Promise<Plugin> {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGFM,
      remarkPluginFrontmatter,
      [remarkPluginMDXFrontmatter, { name: 'frontmatter' }],
      remarkPluginTOC
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
      ],
      rehypePluginPreWrapper,
      [
        rehypePluginShiki,
        {
          highlighter: await shiki.getHighlighter({ theme: 'nord' })
        }
      ]
    ]
  }) as unknown as Plugin
}
