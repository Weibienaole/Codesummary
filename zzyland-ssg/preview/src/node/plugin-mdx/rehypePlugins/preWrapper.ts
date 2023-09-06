import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Element, Root } from 'hast'

export const rehypePluginPreWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    // 遍历节点
    visit(tree, 'element', (node) => {
      // 标签为pre，且子元素是element并且是code标签，且过滤筛选标识
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code' &&
        !node.data?.isVisit
      ) {
        const codeNode = node.children[0]
        const codeNodeClassName =
          codeNode.properties?.className?.toString() || ''
        // language-js --> js
        const lang = codeNodeClassName.split('-')[1]

        const cloneNode: Element = {
          type: 'element',
          tagName: 'pre',
          children: node.children,
          properties: node.properties,
          data: {
            isVisit: true
          }
        }

        // 将原有的pre更改为div
        node.tagName = 'div'
        node.properties = node.properties || {}
        node.properties.className = codeNodeClassName

        // 在div中注入span以及之前的pre
        node.children = [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'lang'
            },
            children: [
              {
                type: 'text',
                value: lang
              }
            ]
          },
          cloneNode
        ]
      }
    })
  }
}
