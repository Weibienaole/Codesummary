import { declare } from '@babel/helper-plugin-utils'
import type { Visitor } from '@babel/traverse'
import type { PluginPass } from '@babel/core'
import { types as t } from '@babel/core'
import { MASK_SPLITTER } from './constants'
import { normalizePath } from 'vite'
export default declare((api) => {
  api.assertVersion(7)

  const visitor: Visitor<PluginPass> = {
    // 这里捕获到jsx标签
    JSXOpeningElement(path, state) {
      const name = path.node.name
      let bindingName = ''

      // 获取到组件名称
      if (name.type === 'JSXIdentifier') {
        // 单导出组件
        bindingName = name.name
      } else if (name.type === 'JSXMemberExpression') {
        // A.B.C类型组件，持续遍历到最深处获取
        let object = name.object
        while (t.isJSXMemberExpression(object)) {
          object = object.object
        }
        bindingName = object.name
      } else return

      // 根据作用域信息获取引入位置
      const binding = path.scope.getBinding(bindingName)
      if (binding?.path.parent.type === 'ImportDeclaration') {
        // 定位到import语句，拿到对应的引入路径
        const source = binding.path.parent.source
        const attirbutes = (path.container as t.JSXElement).openingElement
          .attributes
        for (let i = 0; i < attirbutes.length; i++) {
          const name = (attirbutes[i] as t.JSXAttribute).name
          if (name?.name === '__zisland') {
            // 将属性名称的value进行赋值
            attirbutes[i].value = t.stringLiteral(
              `${source.value}${MASK_SPLITTER}${normalizePath(
                state.filename || ''
              )}`
            )
          }
        }
      }
    }
  }

  return {
    name: 'transfrom-jsx-zisland',
    visitor
  }
})
