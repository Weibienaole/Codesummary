import React, { memo, useRef, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import * as actionCreators from '../store/actionCreators'
import { playMode } from '../../../api/config'
import {
  PlayListWrapper,
  ScrollWrapper,
  ListHeader,
  ListContent
} from './style'
import { prefixStyle, getName, shuffle, findIndex } from '../../../api/utils'

import Scroll from '../../../baseUI/Scroll'
import Confirm from '../../../baseUI/Confirm'

const PlayList = (props) => {
  const {
    showPlayList,
    currentIndex,
    currentSong,
    playList,
    sequencePlayList,
    mode
  } = props
  const {
    toggleShowPlayListDispatch,
    tpgglePlayModeDispatch,
    changeCurrentIndexDispatch,
    changePlayListDispatch,
    deleteSongDispatch,
    clearDispatch
  } = props

  const [isShow, setIsShow] = useState(false)
  // 是否允许滑动关闭
  const [canTouch, setCanTouch] = useState(false)
  // 滑动开始的y距离
  const [startY, setStartY] = useState(0)
  // 是否在滑动中
  const [iniaialed, setInitialed] = useState(false)
  // 下滑距离
  const [distance, setDistance] = useState(0)

  const playListRef = useRef()
  const listWrapperRef = useRef()
  const confirmRef = useRef()
  const listScrollRef = useRef()

  const transform = prefixStyle('transform')
  const currentSongJS = currentSong.toJS()
  const playListJS = playList.toJS()
  const sequencePlayListJS = sequencePlayList.toJS()

  const onEnterCB = useCallback(() => {
    setIsShow(true)
    // 最开始是隐藏在下面
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])

  const onEnteringCB = useCallback(() => {
    // 让列表展现
    listWrapperRef.current.style['transition'] = 'all 0.3s'
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
  }, [transform])

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style['transition'] = 'all 0.3s'
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`
  }, [transform])

  const onExitedCB = useCallback(() => {
    setIsShow(false)
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`
  }, [transform])

  // 显示清除全部弹窗
  const handleShowClear = () => {
    confirmRef.current.show()
  }

  // 切换歌曲
  const handleChangeCurrentIndex = (e, index) => {
    if (index === currentIndex) return
    changeCurrentIndexDispatch(index)
  }

  // 删除歌曲
  const handleDeleteSong = (e, item) => {
    e.stopPropagation()
    deleteSongDispatch(item)
  }

  // 确认删除
  const handleConfirm = () => {
    clearDispatch()
  }

  const handleTouchStart = (e) => {
    if(!canTouch || iniaialed) return
    listWrapperRef.current.style.transition = ''
    setStartY(e.nativeEvent.touches[0].pageY)
    setInitialed(true)
  }
  
  const handleTouchMove = e => {
    if(!canTouch || !iniaialed) return
    const distance = e.nativeEvent.touches[0].pageY - startY
    if(distance < 0) return
    setDistance(distance)
    listWrapperRef.current.style[transform] = `translate3d(0, ${distance}px, 0)`
  }

  const handleTouchEnd = e => {
    setInitialed(false)
    const MAX_SCROLL = 150 // 最大滚动阈值
    if(distance >= MAX_SCROLL){
      // 关闭
      toggleShowPlayListDispatch(false)
      setDistance(0)
    }else{
      listWrapperRef.current.style.transition = `all .3s`
      listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
    }
  }

  const handleScroll = pos => {
    // 只有在顶部的时候才可以滑动关闭
    let state = pos.y === 0
    setCanTouch(state)
  }

  // 获取播放模式
  const getPlayMode = () => {
    let content, text
    if (mode === playMode.sequence) {
      content = '&#xe625;'
      text = '顺序播放'
    } else if (mode === playMode.loop) {
      content = '&#xe653;'
      text = '单曲循环'
    } else {
      content = '&#xe61b;'
      text = '随机播放'
    }
    return (
      <div>
        <i
          className="iconfont"
          onClick={(e) => changeMode(e)}
          dangerouslySetInnerHTML={{ __html: content }}
        ></i>
        <span className="text" onClick={(e) => changeMode(e)}>
          {text}
        </span>
      </div>
    )
  }

  const changeMode = (e) => {
    let newMode = (mode + 1) % 3
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayListJS)
      let index = findIndex(currentSongJS, sequencePlayListJS)
      changeCurrentIndexDispatch(index)
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayListJS)
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequencePlayListJS)
      let index = findIndex(currentSongJS, newList)
      changePlayListDispatch(newList)
      changeCurrentIndexDispatch(index)
    }
    tpgglePlayModeDispatch(newMode)
  }

  // 是否播放当前歌曲(是显示icon)
  const getCurrentIcon = (item) => {
    const current = currentSongJS.id === item.id
    const className = current ? 'icon-play' : ''
    const content = current ? '&#xe6e3;' : ''
    return (
      <i
        className={`iconfont current ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      ></i>
    )
  }
  const listScrollWrapper = () => {
    return (
      <ScrollWrapper>
        <Scroll
          onScroll={pos => handleScroll(pos)}
          ref={listScrollRef}
          bounceTop={false}
        >
          <div>
            <ListContent>
              {playListJS.map((item, index) => (
                <li
                  className="item"
                  key={item.id}
                  onClick={(e) => handleChangeCurrentIndex(e, index)}
                >
                  {getCurrentIcon(item)}
                  <span className="text">
                    {item.name} - {getName(item.ar)}
                  </span>
                  <span className="like">
                    <i className="iconfont">&#xe601;</i>
                  </span>
                  <span
                    className="delete"
                    onClick={(e) => handleDeleteSong(e, item)}
                  >
                    <i className="iconfont">&#xe63d;</i>
                  </span>
                </li>
              ))}
            </ListContent>
          </div>
        </Scroll>
      </ScrollWrapper>
    )
  }
  return (
    <CSSTransition
      in={showPlayList}
      classNames="list-fade"
      timeout={300}
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
      nodeRef={playListRef}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow ? { display: 'block' } : { display: 'none' }}
        onClick={() => toggleShowPlayListDispatch(false)}
      >
        <div
          className="list_wrapper"
          ref={listWrapperRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>
                &#xe63d;
              </span>
            </h1>
          </ListHeader>
          {listScrollWrapper()}
        </div>
        <Confirm
          ref={confirmRef}
          text={'是否删除全部？'}
          cancelBtnText={'取消'}
          confirmBtnText={'确定'}
          handleConfirm={handleConfirm}
        />
      </PlayListWrapper>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => ({
  showPlayList: state.getIn(['player', 'showPlayList']),
  playList: state.getIn(['player', 'playList']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  currentSong: state.getIn(['player', 'currentSong']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
  mode: state.getIn(['player', 'mode'])
})

const mapDispatchToProps = (dispatch) => ({
  toggleShowPlayListDispatch(bol) {
    dispatch(actionCreators.changeShowPlayList(bol))
  },
  tpgglePlayModeDispatch(type) {
    dispatch(actionCreators.changePlayMode(type))
  },
  changePlayListDispatch(list) {
    dispatch(actionCreators.changePlayList(list))
  },
  changeCurrentIndexDispatch(idx) {
    dispatch(actionCreators.changeCurrentIndex(idx))
  },
  deleteSongDispatch(item) {
    dispatch(actionCreators.deleteSong(item))
  },
  clearDispatch() {
    dispatch(actionCreators.changePlayList([]))
    dispatch(actionCreators.changeSequencePlayList([]))
    dispatch(actionCreators.changeCurrentIndex(-1))
    dispatch(actionCreators.changePlayState(false))
    dispatch(actionCreators.changeShowPlayList(false))
    dispatch(actionCreators.changeCurrentSong({}))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(memo(PlayList))
