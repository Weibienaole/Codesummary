import { fromJS } from 'immutable'

import * as actionTypes from './constant'
import { getHotSingerListReq, getSingerListReq } from '../../../api/request'

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data: fromJS(data)
})

export const changePullUpLoading = (data) => ({
  type: actionTypes.CHANGE_PULLUP_LOADING,
  data: fromJS(data)
})

export const changePullDownLoading = (data) => ({
  type: actionTypes.CHANGE_PULLDOWN_LOADING,
  data: fromJS(data)
})

export const changePageCount = (data) => ({
  type: actionTypes.CHANGE_PAGE_COUNT,
  data: fromJS(data)
})

export const changeAlpha = (data) => ({
  type: actionTypes.CHANGE_ALPHA,
  data: fromJS(data)
})

export const changeHotSingerList = (data) => ({
  type: actionTypes.CHANGE_SINGER_LIST,
  data: fromJS(data)
})

export const changeSingerList = (data) => ({
  type: actionTypes.CHANGE_SINGER_LIST,
  data: fromJS(data)
})


// 首次加载热门列表
export const getHotSingerList = () => {
  return dispatch => {
    getHotSingerListReq().then(res => {
      dispatch(changeHotSingerList(res.artists))
      dispatch(changeEnterLoading(false))
      dispatch(changePullDownLoading(false))
    }).catch(err => {
      console.error('热门歌手列表获取失败', err);
    })
  }
}

// 加载更多热门列表
export const getMoreHotSingerList = (pageCount) => {
  return (dispatch, getState) => {
    getHotSingerListReq(pageCount).then(res => {
      const oldD = [...(getState().getIn(['singers', 'singerList'])).toJS()]
      dispatch(changePageCount(pageCount))
      dispatch(changeHotSingerList([...oldD, ...res.artists]))
      dispatch(changePullUpLoading(false))

    }).catch(err => {
      console.error('热门歌手列表获取失败', err);
    })
  }
}

// 首次加载分类列表
export const getSingerList = (type, area, initial) => {
  return (dispatch, getState) => {
    getSingerListReq(0, type, area, initial).then(res => {
      dispatch(changeSingerList(res.artists))
      dispatch(changeEnterLoading(false))
      dispatch(changePullDownLoading(false))
    }).catch(err => {
      console.error('歌手分类列表获取失败', err);
    })
  }
}

// 加载更多分类列表
export const getMoreSingerList = (pageCount, type, area, initial) => {
  return (dispatch, getState) => {
    getSingerListReq(pageCount, type, area, initial).then(res => {
      const oldD = [...(getState().getIn(['singers', 'singerList'])).toJS()]
      dispatch(changePageCount(pageCount))
      dispatch(changeSingerList([...oldD, ...res.artists]))
      dispatch(changePullUpLoading(false))
    }).catch(err => {
      console.error('歌手分类列表获取失败', err);
    })
  }
}