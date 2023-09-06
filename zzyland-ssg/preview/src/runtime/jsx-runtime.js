import * as jsxRuntime from 'react/jsx-runtime'

const originJsx = jsxRuntime.jsx
const originJsxs = jsxRuntime.jsxs

export const data = {
  zislandProps: [],
  zislandToPathMap: {}
}

const internalJsx = (jsx, type, props, ...args) => {
  // 拦截并记录
  if (props && props.__zisland) {
    data.zislandProps.push(props)
    const id = type.name
    data['zislandToPathMap'][id] = props.__zisland

    delete props.__zisland

    // 外部添加一个容器记录zisland的信息，赖标识组件ID以及位置
    return jsx('div', {
      __zisland: `${id}:${data.zislandProps.length - 1}`,
      children: jsx(type, props, ...args)
    })
  }
  return jsx(type, props, ...args)
}

// 自定义jsx和jsxs，以及携带的Fragment
export const jsx = (...args) => internalJsx(originJsx, ...args)
export const jsxs = (...args) => internalJsx(originJsxs, ...args)
export const Fragment = jsxRuntime.Fragment

// 提供清空数据函数，避免污染
export const clearRuntimeData = () => {
  data.zislandProps = []
  data.zislandToPathMap = {}
}
