import { fromJS } from "immutable";
import * as actionTypes from './constants'

const defaultState = fromJS({
  hotKeywordsList: [], // 热门关键词列表
  suggestList: [], // 列表，歌单，歌手列表
  songsList: [], // 歌曲列表
  enterLoading: false,
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_HOT_KEYWORDS:
      return state.set('hotKeywordsList', action.data)
    case actionTypes.CHANGE_SONGS_LIST:
      return state.set('songsList', action.data)
    case actionTypes.CHANGE_SUGGEST_LIST:
      return state.set('suggestList', action.data)
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    default:
      return state
  }
}

export default reducer