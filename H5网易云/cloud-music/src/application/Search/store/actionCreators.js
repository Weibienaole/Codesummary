import { fromJS } from 'immutable'
import * as actionTypes from './constants'
import { getHotKeywordsListReq, getSearchSuggestReq, getSearchResultReq } from '../../../api/request'

export const changeHotKeywords = data => ({
  type: actionTypes.CHANGE_HOT_KEYWORDS,
  data: fromJS(data)
})

export const changeSuggestList = data => ({
  type: actionTypes.CHANGE_SUGGEST_LIST,
  data: fromJS(data)
})

export const changeSongsList = data => ({
  type: actionTypes.CHANGE_SONGS_LIST,
  data: fromJS(data)
})

export const changeEnterLoading = data => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})

// 获取关键词信息
export const getHotKeywords = () => {
  return dispatch => {
    getHotKeywordsListReq().then(res => {
      const data = res.result?.hots || []
      dispatch(changeHotKeywords(data))
    })
  }
}

// 获取搜索建议以及搜索内容
export const getSearchResult = keywords => {
  return dispatch => {
    dispatch(changeEnterLoading(true))
    getSearchSuggestReq(keywords).then(res => {
      if (!res) return
      const data = res.result || []
      dispatch(changeSuggestList(data))
    }).catch(err => {
      console.error('获取搜索建议出错！', err);
    })
    getSearchResultReq(keywords).then(res => {
      if (!res) return
      const data = res.result?.songs || []
      dispatch(changeSongsList(data))
      dispatch(changeEnterLoading(false))
    }).catch(err => {
      console.error('获取搜索结果出错！', err);
    })
  }
}