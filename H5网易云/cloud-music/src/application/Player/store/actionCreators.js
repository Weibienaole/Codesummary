import { fromJS } from 'immutable'
import * as actionTypes from './constants'
import { getSongDetailReq } from '../../../api/request'

export const changeFullScreen = data => ({
  type: actionTypes.CHANGE_FULL_SCREEN,
  data: fromJS(data)
})

export const changePlayState = data => ({
  type: actionTypes.CHANGE_PLAYING_STATE,
  data: fromJS(data)
})

export const changeSequencePlayList = data => ({
  type: actionTypes.CHANGE_SEQUENCE_PLAYLIST,
  data: fromJS(data)
})

export const changePlayList = data => ({
  type: actionTypes.CHANGE_PLAYLIST,
  data: fromJS(data)
})

export const changePlayMode = data => ({
  type: actionTypes.CHANGE_PLAY_MODE,
  data: fromJS(data)
})

export const changeCurrentIndex = data => ({
  type: actionTypes.CHANGE_CURRENT_INDEX,
  data: fromJS(data)
})

export const changeShowPlayList = data => ({
  type: actionTypes.CHANGE_SHOW_PLAYLIST,
  data: fromJS(data)
})

export const changeCurrentSong = data => ({
  type: actionTypes.CHANGE_CURRENT_SONG,
  data: fromJS(data)
})

export const deleteSong = data => ({
  type: actionTypes.DELETE_SONG,
  data: data
})

export const insertSong = data => ({
  type: actionTypes.INSERT_SONG,
  data
})

export const changeSpeed = data => ({
  type: actionTypes.CHANGE_SPEED,
  data
})

export const getSongDetail = id => {
  return dispatch => {
    getSongDetailReq(id).then(res => {
      let song = res.songs[0];
      dispatch(insertSong(song))
    }).catch(err => {
      console.error('获取歌曲详情失败！', err);
    })
  }
}