import type { Plugin } from 'unified'
import Slugger from 'github-slugger'
import { visit } from 'unist-util-visit'
import { Root } from 'hast'
import type { MdxjsEsm, Program } from 'mdast-util-mdxjs-esm'
import { parse } from 'acorn'

interface TocItem {
  id: string
  text: string
  depth: number
}

interface ChildNode {
  type: 'link' | 'text' | 'inlineCode'
  value: string
  children?: ChildNode[]
}

export const remarkPluginTOC: Plugin<[], Root> = () => {
  return (tree) => {
    const toc: TocItem[] = []
    const slugger = new Slugger()
    let title = ''
    // 查找 heading 类型
    visit(tree, 'heading', (node) => {
      // depth 1---5  -> h1 --- h5
      // 不是标题类节点且没子项进行排除
      if (!node.depth || !node.children) {
        return
      }
      // 拦截h1为title
      if (node.depth === 1) {
        title = (node.children[0] as ChildNode).value
      }
      // h1 --- h4
      if (node.depth > 1 && node.depth < 5) {
        const originText = (node.children as ChildNode[])
          .map((child) => {
            // 如果是一个link节点，获取子节点的文本，否则就直接获取文本
            switch (child.type) {
              case 'link':
                return child.children?.map((c) => c.value).join('') || ''
              default:
                return child.value
            }
          })
          .join('')
        // 生成唯一ID
        const id = slugger.slug(originText)
        toc.push({
          id,
          text: originText,
          depth: node.depth
        })
      }
    })
    // 生成需要在页面内导出的模块的代码
    const insertCode = `export const toc = ${JSON.stringify(toc, null, 2)}`

    // 当前节点树下进行插入
    tree.children.push({
      type: 'mdxjsEsm',
      value: insertCode,
      data: {
        estree: parse(insertCode, {
          ecmaVersion: 2020,
          sourceType: 'module'
        }) as unknown as Program
      }
    } as MdxjsEsm)

    // title同理
    if (title) {
      const insertTitle = `export const title = '${title}'`
      tree.children.push({
        type: 'mdxjsEsm',
        value: insertTitle,
        data: {
          estree: parse(insertTitle, {
            ecmaVersion: 2020,
            sourceType: 'module'
          }) as unknown as Program
        }
      } as MdxjsEsm)
    }
  }
}
