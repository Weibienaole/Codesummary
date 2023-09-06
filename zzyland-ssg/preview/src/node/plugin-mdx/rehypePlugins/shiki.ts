import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Text, Root } from 'hast'
import { fromHtml } from 'hast-util-from-html'
import shiki from 'shiki'

interface Options {
  highlighter: shiki.Highlighter
}

export const rehypePluginShiki: Plugin<[Options], Root> = ({ highlighter }) => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // 筛选出需要处理的节点
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        const nodeCode = node.children[0]
        const nodeCodeText = (nodeCode.children[0] as Text).value
        const nodeClassName = nodeCode.properties?.className?.toString() || ''
        const lang = nodeClassName.split('-')[1]
        if (!lang) {
          return
        }

        // shiki高亮处理
        const highlightedCode = highlighter.codeToHtml(nodeCodeText, { lang })
        // 将处理后的string转换成AST
        const formatterAST = fromHtml(highlightedCode, { fragment: true })
        parent.children.splice(index, 1, ...formatterAST.children)
      }
    })
  }
}
