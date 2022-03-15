// 存放不同action

import * as actionTypes from './constants'
import { fromJS } from 'immutable' // 将js转化为immutable对象
import { getBannerReq, getRecommendListReq } from '../../../api/request'

export const changeBannerList = (data) => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS(data)
})

export const changeRecommendList = (data) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS(data)
})

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data: fromJS(data)
})



export const getBannerList = () => {
  return dispatch => {
    getBannerReq().then(res=> {
      dispatch(changeBannerList(res.banners))
    }).catch(err => {
      console.error('banner数据获取错误：', err);
    })
  }
}

export const getRecommendList = () => {
  return dispatch => {
    getRecommendListReq().then(res => {
      dispatch(changeRecommendList(res.result))
      dispatch(changeEnterLoading(false))
    }).catch(err => {
      console.error('推荐歌单数据获取错误：', err);
    })
  }
}