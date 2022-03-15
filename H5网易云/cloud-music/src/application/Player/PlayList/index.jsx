import React, { memo, useRef, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import * as actionCreators from '../store/actionCreators'
import { playMode } from '../../../api/config'
import {
  changeShowPlayList,
  changeCurrentIndex,
  changePlayMode,
  changePlayList
} from '../store/actionCreators'
import { PlayListWrapper, ScrollWrapper } from './style'
import { prefixStyle } from '../../../api/utils'

import Scroll from '../../../baseUI/Scroll'

const PlayList = (props) => {
  const { showPlayList } = props
  const { toggleShowPlayListDispatch } = props

  const [isShow, setIsShow] = useState(false)

  const playListRef = useRef()
  const listWrapperRef = useRef()

  const transform = prefixStyle('transform')

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
  return (
    <CSSTransition
      in={showPlayList}
      classNames="list-fade"
      timeout={300}
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow ? { display: 'block' } : { display: 'none' }}
        onClick={() => toggleShowPlayListDispatch(false)}
      >
        <div className="list_wrapper" ref={listWrapperRef}>
          <ScrollWrapper></ScrollWrapper>
        </div>
      </PlayListWrapper>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => ({
  showPlayList: state.getIn(['player', 'showPlayList'])
})

const mapDispatchToProps = (dispatch) => ({
  toggleShowPlayListDispatch(bol) {
    dispatch(actionCreators.changeShowPlayList(bol))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(memo(PlayList))
