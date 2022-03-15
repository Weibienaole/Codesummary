import { fromJS } from "immutable";
import { CHANGE_SINGER_SONGS_LIST, CHANGE_ENTER_LOADING, CHANGE_ARTIST } from './constants'
import { getSingerSongsListReq } from "../../../api/request";

export const changeSingerSongsList = data => ({
  type: CHANGE_SINGER_SONGS_LIST,
  data: fromJS(data)
})

export const changeArtist = data => ({
  type: CHANGE_ARTIST,
  data: fromJS(data)
})

export const changeEnterLoading = data => ({
  type: CHANGE_ENTER_LOADING,
  data: fromJS(data)
})

export const getSingerSongsListData = id => {
  return dispatch => {
    getSingerSongsListReq(id).then(res => {
      dispatch(changeEnterLoading(false))
      dispatch(changeSingerSongsList(res.hotSongs))
      dispatch(changeArtist(res.artist))
    })
  }
}