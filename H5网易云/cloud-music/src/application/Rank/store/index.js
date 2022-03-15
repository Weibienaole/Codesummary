
import { fromJS } from 'immutable'

import { getRankListReq } from '../../../api/request'

// contsant
const CHANGE_RANK_LIST = 'rank/CHANGE_RANK_LIST'
const CHANGE_ENTER_LOADING = 'rank/CHANGE_ENTER_LOADING'

// reducer
const defaultState = fromJS({
  rankList: [],
  enterLoading: true
})
export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_RANK_LIST:
      return state.set('rankList', action.data)
    case CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    default:
      return state
  }
}

// actionCreator
export const changeRankList = (data) => ({
  type: CHANGE_RANK_LIST,
  data: fromJS(data)
})

export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data: fromJS(data)
})

export const getRankList = () => {
  return (dispatch) => {
    getRankListReq().then((res) => {
      dispatch(changeRankList(res.list))
      dispatch(changeEnterLoading(false))
    })
  }
}
