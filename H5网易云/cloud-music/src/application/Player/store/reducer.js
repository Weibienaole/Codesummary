import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { playMode } from '../../../api/config'
import { findIndex } from '../../../api/utils'
import { deepClone } from 'zzy-javascript-devtools'

const defaultState = fromJS({
  fullScreen: false, // 是否为全屏模式
  playing: false, // 当前歌曲是否播放
  sequencePlayList: [], // 顺序列表 (因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: [],
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放音乐下标
  showPlayList: false, // 是否展示播放列表
  currentSong: {}, // 选中歌曲详情
  speed: 1, // 歌曲倍速
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_FULL_SCREEN:
      return state.set('fullScreen', action.data)
    case actionTypes.CHANGE_PLAYING_STATE:
      return state.set('playing', action.data)
    case actionTypes.CHANGE_SEQUENCE_PLAYLIST:
      return state.set('sequencePlayList', action.data)
    case actionTypes.CHANGE_PLAYLIST:
      return state.set('playList', action.data)
    case actionTypes.CHANGE_PLAY_MODE:
      return state.set('mode', action.data)
    case actionTypes.CHANGE_CURRENT_INDEX:
      return state.set('currentIndex', +action.data)
    case actionTypes.CHANGE_SHOW_PLAYLIST:
      return state.set('showPlayList', action.data)
    case actionTypes.CHANGE_CURRENT_SONG:
      return state.set('currentSong', action.data)
    case actionTypes.DELETE_SONG:
      return handleDeleteSong(state, action.data)
    case actionTypes.INSERT_SONG:
      return handleInsertSong(state, action.data)
    case actionTypes.CHANGE_SPEED:
      return state.set('speed', action.data)
    default:
      return state
  }
}

// 删除
const handleDeleteSong = (state, song) => {
  const playList = deepClone(state.get('playList').toJS())
  const sequencePlayList = deepClone(state.get('sequencePlayList').toJS())

  let currentIndex = state.get('currentIndex')
  const fpIndex = findIndex(song, playList)

  playList.splice(fpIndex, 1)
  if (fpIndex < currentIndex) currentIndex--

  const fqIndex = findIndex(song, sequencePlayList)
  sequencePlayList.splice(fqIndex, 1)

  return state.merge({
    'playList': fromJS(playList),
    'sequencePlayList': fromJS(sequencePlayList),
    'currentIndex': fromJS(currentIndex)
  })
}

// 插入歌曲
const handleInsertSong = (state, song) => {
  const playList = deepClone(state.get('playList').toJS())
  const sequencePlayList = deepClone(state.get('sequencePlayList').toJS())
  let currentIndex = state.get('currentIndex')

  // 找到歌曲在播放列表中的下标
  const fpIndex = findIndex(song, playList)
  // 如果是当前曲子，则不作处理
  if (fpIndex === currentIndex && currentIndex !== -1) return state
  // 播放下标+1
  currentIndex++
  // 放到下一首的位置
  playList.splice(currentIndex, 0, song)
  // 如果找到了要播放的歌曲
  if (fpIndex > -1) {
    // 如果fpIndex索引比目前播放的歌曲小
    if (fpIndex < currentIndex) {
      // 删除一位，且index--
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 直接删除一位
      playList.splice(fpIndex + 1, 1)
    }
  }
  // 同理处理sequenceList
  // 找到当前曲目在sequenceList中的下标
  let sequenceIndex = findIndex(playList[currentIndex], sequencePlayList) + 1
  const fsIndex = findIndex(song, sequencePlayList)
  // 插入歌曲
  sequencePlayList.splice(sequenceIndex, 0, song)
  if (fsIndex > -1) {
    if (fsIndex < sequencePlayList) {
      sequencePlayList.splice(fsIndex, 1)
      sequenceIndex--
    } else {
      sequencePlayList.splice(fsIndex + 1, 1)
    }
  }
  return state.merge({
    'playList': fromJS(playList),
    'sequencePlayList': fromJS(sequencePlayList),
    'currentIndex': fromJS(currentIndex),
  })
}

export default reducer