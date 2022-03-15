import { fromJS } from "immutable";

import { CHANGE_ALBUM_LIST, CHANGE_ENTER_LOADING } from "./contants";
import { getAlbumListReq } from "../../../api/request";

export const changeAlbumList = data => ({
  type: CHANGE_ALBUM_LIST,
  data: fromJS(data)
})

export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data: fromJS(data)
})

export const getAlbumList = id => {
  return dispatch => {
    getAlbumListReq(id).then(res => {
      dispatch(changeAlbumList(res.playlist))
      dispatch(changeEnterLoading(false))
    }).catch(err=> {
      console.error('歌单详情列表获取失败！', err);
    })
  }
}