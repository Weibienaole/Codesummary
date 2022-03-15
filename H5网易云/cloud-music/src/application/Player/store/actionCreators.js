import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { playMode } from '../../../api/config'

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
