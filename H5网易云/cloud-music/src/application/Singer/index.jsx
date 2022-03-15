import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import {
  Container,
  ImgWrapper,
  CollectButton,
  BgLayer,
  SongListWrapper
} from './style'
import { HEADER_HEIGHT } from '../../api/config'
import Header from '../../baseUI/Header'
import Scroll from '../../baseUI/Scroll'
import SongsList from '../SongsList'
import Loading from '../../baseUI/Loading'
import MusicNote from '../../baseUI/MusicNote'
import { getSingerSongsListData, changeEnterLoading } from './store/actionCreators'

const Singer = (props) => {
  const { history, match } = props

  const { singerSongsList, enterLoading, artist, playerList } = props

  const { getSingerSongsList } = props

  const [showStatus, setShowStatus] = useState(true)

  useEffect(() => {
    getSingerSongsList(match.params.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const nodeRef = useRef()
  const headerRef = useRef()
  const imgWrapperRef = useRef()
  const collectButtonRef = useRef()
  const bgLayerRef = useRef()
  const scrollListWrapperRef = useRef()
  const songScrollRef = useRef()
  const musicNoteRef = useRef()

  // 图片初始高度
  const initialHeight = useRef(0)

  // 向上偏移像素点，漏出圆角
  const OFFSET = 5

  useEffect(() => {
    // 获取图片高度
    let h = imgWrapperRef.current.offsetHeight
    // 更新top，漏出图片
    scrollListWrapperRef.current.style.top = `${h - OFFSET}px`
    // 遮罩同步
    bgLayerRef.current.style.top = `${h - OFFSET}px`
    // 存储高度
    initialHeight.current = h
    // 更新滚动条
    songScrollRef.current.refresh()
  }, [])

  const clickHeader = useCallback(() => {
    setShowStatus(false)
  }, [])

  const handelScroll = useCallback(({ y }) => {
    const height = initialHeight.current
    const newY = y
    const imgDOM = imgWrapperRef.current
    const buttonDOM = collectButtonRef.current
    const bgLayerDOM = bgLayerRef.current
    const headerDOM = headerRef.current
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT

    const percent = Math.abs(newY / height)

    // 下滑
    if (newY > 0) {
      imgDOM.style.transform = `scale(${1 + percent})`
      buttonDOM.style.transform = `translate3d(0, ${newY}px, 0)`
      bgLayerDOM.style.top = `${height - OFFSET + newY}px`
      // 上滑，且不超过顶部栏
    } else if (newY >= minScrollY) {
      bgLayerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`
      // 保证遮罩高于图片
      bgLayerDOM.style.zIndex = 1
      imgDOM.style.paddingTop = '75%'
      imgDOM.style.zIndex = -1
      imgDOM.style.height = 0

      // 按钮向上且逐渐透明
      buttonDOM.style.opacity = 1 - percent * 2
      buttonDOM.style.transform = `translate3d(0, ${newY}px, 0)`
      // 上划，且超过header
    } else if (newY < minScrollY) {
      // 保证在最上层
      headerDOM.style.zIndex = 100
      // 遮罩固定高度且保证被遮盖
      bgLayerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`
      bgLayerDOM.style.zIndex = 1
      // 图片为导航栏背景，且比遮罩层级高，并与导航栏同步高度，取消paddingTop
      imgDOM.style.zIndex = 99
      imgDOM.style.paddingTop = 0
      imgDOM.style.height = `${HEADER_HEIGHT}px`
    }
  }, [])

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }


  const artistJS = artist.toJS()
  const singerSongsListJS = singerSongsList.toJS()
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      nodeRef={nodeRef}
      onExited={() => history.goBack()}
    >
      <Container ref={nodeRef} isPlayer={playerList.toJS().length > 0}>
        <Header title={artistJS.name} handleClick={clickHeader} ref={headerRef} />
        <ImgWrapper bgUrl={artistJS.picUrl} ref={imgWrapperRef}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButtonRef}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={bgLayerRef}></BgLayer>
        <SongListWrapper ref={scrollListWrapperRef}>
          <Scroll ref={songScrollRef} onScroll={handelScroll}>
            <div>
              <SongsList showCollect={false} song={singerSongsListJS} musicAnimation={musicAnimation}></SongsList>
            </div>
          </Scroll>
        </SongListWrapper>
        <Loading show={enterLoading} />
        <MusicNote ref={musicNoteRef} />
      </Container>
    </CSSTransition>
  )
}

const mapStatetoProps = state => ({
  singerSongsList: state.getIn(['singer', 'singerSongsList']),
  enterLoading: state.getIn(['singer', 'enterLoading']),
  artist: state.getIn(['singer', 'artist']),
  playerList: state.getIn(['player', 'playList'])
})

const mapDispatchToProps = dispatch => ({
  getSingerSongsList(id){
    dispatch(changeEnterLoading(true))
    dispatch(getSingerSongsListData(id))
  }
})

export default connect(mapStatetoProps, mapDispatchToProps)(memo(Singer))
