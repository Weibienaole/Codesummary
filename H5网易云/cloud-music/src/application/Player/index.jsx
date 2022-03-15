import React, { memo, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import * as actionCreators from './store/actionCreators'
import { PlayerContainer } from './style'
import { getSongUrl, isEmptyObject, findIndex, shuffle } from '../../api/utils'
import { playMode } from '../../api/config'
import MiniPlayer from './MiniPlayer'
import NormalPlayer from './NormalPlayer'
import PlayList from './PlayList'
import Toast from '../../baseUI/Toast'

let playControlTimer = null

const Player = (props) => {
  const {
    fullScreen,
    playing,
    mode,
    currentIndex,
    sequencePlayList,
    playList,
    showPlayList,
    currentSong
  } = props
  const {
    toggleFullScreenDispatch,
    togglePlayStateDispatch,
    togglePlayModeDispatch,
    toggleShowPlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentSongDispatch,
    changePlayListDispatch
  } = props

  // 当前播放时间
  const [currentTime, setCurrentTime] = useState(0)
  // 总长度
  const [duration, setDuration] = useState(0)
  // 记录当前播放歌曲
  const [preSong, setPreSong] = useState({})
  const [songReady, setSongReady] = useState(true)
  // 弹窗文案
  const [toastText, setToastText] = useState('')

  const audioRef = useRef()
  const toastRef = useRef()
  // 进度
  const percent = isNaN(currentTime / duration) ? 0 : currentTime / duration

  const currentSongJs = currentSong.toJS()
  // const modeJS = mode.toJS()
  const sequencePlayListJS = sequencePlayList.toJS()
  const playListJS = playList.toJS()
  

  useEffect(() => {
    if (
      !playListJS.length ||
      currentIndex === -1 ||
      !playListJS[currentIndex] ||
      playListJS[currentIndex].id === preSong.id ||
      !songReady
    )
      return
    const current = playListJS[currentIndex]
    setPreSong(current)
    setSongReady(false)
    changeCurrentSongDispatch(current)
    audioRef.current.src = getSongUrl(current.id)
    playControlTimer = setTimeout(() => {
      // 从 audio 标签拿到 src 加载到能够播放之间有一个缓冲的过程，只有当控件能够播放时才能够切到下一首。如果在这个缓冲过程中切歌就会报错。
      audioRef.current.play().then(() => {
        setSongReady(true)
      })
      clearTimeout(playControlTimer)
    })
    togglePlayStateDispatch(true)
    setCurrentTime(0)
    setDuration((current.dt / 1000) | 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playListJS, currentIndex])

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause()
  }, [playing])

  const clickPlaying = (e, bol) => {
    e.stopPropagation()
    togglePlayStateDispatch(bol)
  }
  const audioTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime)
  }
  const onProgressChange = (p) => {
    const newTime = p * duration
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
    if (!playing) {
      togglePlayStateDispatch(true)
    }
  }

  // 按钮事件
  // 一首歌循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0
    togglePlayStateDispatch(true)
    audioRef.current.play()
  }
  // 上一首
  const handlePrev = () => {
    // 只有一首时单曲循环
    if (playListJS.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex - 1
    if (index < 0) index = playListJS.length - 1
    if (!playing) togglePlayStateDispatch(true)
    changeCurrentIndexDispatch(index)
  }
  // 下一首
  const handleNext = () => {
    if (playListJS.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex + 1
    if (index === playListJS.length) index = 0
    if (!playing) togglePlayStateDispatch(true)
    changeCurrentIndexDispatch(index)
  }
  // 切换播放模式
  const changeMode = () => {
    const newMode = (mode + 1) % 3
    if (newMode === playMode.sequence) {
      // 顺序
      changePlayListDispatch(sequencePlayListJS)
      const index = findIndex(currentSongJs, sequencePlayListJS)
      changeCurrentIndexDispatch(index)
      setToastText('顺序播放')
    } else if (newMode === playMode.loop) {
      // 单曲
      changePlayListDispatch(sequencePlayListJS)
      setToastText('单曲播放')
    } else if (newMode === playMode.random) {
      // 随机
      const newList = shuffle(sequencePlayListJS)
      const index = findIndex(currentSongJs, newList)
      changePlayListDispatch(newList)
      changeCurrentIndexDispatch(index)
      setToastText('随机播放')
    }
    toastRef.current.show()
    togglePlayModeDispatch(newMode)
  }
  // 播放结束
  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop()
    } else {
      handleNext()
    }
  }
  return (
    <PlayerContainer>
      {isEmptyObject(currentSongJs) ? null : (
        <NormalPlayer
          song={currentSongJs}
          fullScreen={fullScreen}
          percent={percent}
          playing={playing}
          duration={duration}
          currentTime={currentTime}
          mode={mode}
          toggleFullScreen={toggleFullScreenDispatch}
          toggleShowPlayList={toggleShowPlayListDispatch}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleMode={changeMode}
        ></NormalPlayer>
      )}
      {isEmptyObject(currentSongJs) ? null : (
        <MiniPlayer
          song={currentSongJs}
          percent={percent}
          fullScreen={fullScreen}
          playing={playing}
          toggleFullScreen={toggleFullScreenDispatch}
          toggleShowPlayList={toggleShowPlayListDispatch}
          clickPlaying={clickPlaying}
        ></MiniPlayer>
      )}
      <div>
        <audio
          src=""
          ref={audioRef}
          onTimeUpdate={audioTimeUpdate}
          onEnded={handleEnd}
        ></audio>
      </div>
      <PlayList></PlayList>
      <Toast text={toastText} ref={toastRef}></Toast>
    </PlayerContainer>
  )
}

const mapStateToProps = (state) => ({
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
  playList: state.getIn(['player', 'playList']),
  mode: state.getIn(['player', 'mode']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  showPlayList: state.getIn(['player', 'showPlayList']),
  currentSong: state.getIn(['player', 'currentSong'])
})

const mapDispatchToProps = (dispatch) => ({
  toggleFullScreenDispatch(bol) {
    dispatch(actionCreators.changeFullScreen(bol))
  },
  togglePlayStateDispatch(status) {
    dispatch(actionCreators.changePlayState(status))
  },
  togglePlayModeDispatch(status) {
    dispatch(actionCreators.changePlayMode(status))
  },
  toggleShowPlayListDispatch(bol) {
    dispatch(actionCreators.changeShowPlayList(bol))
  },
  changeCurrentIndexDispatch(index) {
    dispatch(actionCreators.changeCurrentIndex(index))
  },
  changeCurrentSongDispatch(data) {
    dispatch(actionCreators.changeCurrentSong(data))
  },
  changePlayListDispatch(data) {
    dispatch(actionCreators.changePlayList(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(memo(Player))
