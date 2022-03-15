import React, { createContext, useReducer } from 'react'
import { fromJS } from 'immutable'

/**
 * 由于在tag切换时 会导致歌手页的类别选中丢失，但是由于列表数据是redux存储的，所以导致两边不统一，所以 使用 HOOK 去模拟redux的核心原理，来让类别数据存储。
 */

// 创建上下文
export const CategoryTypeContext = createContext({})

// 创建常量
export const CHANGE_CATEGORY = 'singer/CHANGE_CATEGORY'
export const CHANGE_CATEGORY2 = 'singer/CHANGE_CATEGORY2'
export const CHANGE_ALPHA = 'singer/CHANGE_ALPHA'

// reducer纯函数
const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE_CATEGORY:
      return state.set('category', action.data)
    case CHANGE_CATEGORY2:
      return state.set('category2', action.data)
    case CHANGE_ALPHA:
      return state.set('alpha', action.data)
    default:
      return state
  }
}

// Provider组件
export const DataProvider = ({children}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // useReducer生成 data和dispatch分别为数据和修改数据的方法(拟redux)
  // useReducer两个参数一个为dispatch处理函数，一个为默认数据
  const [data, dispatch] = useReducer(reducer, fromJS({
    category: '',
    category2: '',
    alpha: ''
  }))
  return (
    // value内将数据通入当前组件内的全局
    <CategoryTypeContext.Provider value={{data, dispatch}}>
      {children}
    </CategoryTypeContext.Provider>
  )
}

