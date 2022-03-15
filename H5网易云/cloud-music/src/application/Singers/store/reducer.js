import * as actionTypes from './constant'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  singerList: [],
  enterLoading: true, // 进场loading
  pullUpLoading: false, // 上拉loading
  pullDownLoading: false, // 下拉loading
  pageCount: 0, // page index
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_SINGER_LIST:
      return state.set('singerList', action.data)
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    case actionTypes.CHANGE_PULLUP_LOADING:
      return state.set('pullUpLoading', action.data)
    case actionTypes.CHANGE_PULLDOWN_LOADING:
      return state.set('pullDownLoading', action.data)
    case actionTypes.CHANGE_PAGE_COUNT:
      return state.set('pageCount', action.data)
    default:
      return state
  }
}
export default reducer