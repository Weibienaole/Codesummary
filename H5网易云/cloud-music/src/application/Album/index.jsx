import React, { memo, useState, useCallback, useRef, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import { Container, TopDesc, Menu, SongList, SongItem } from './style'
import style from '../../assets/global-style'
import { getCount, getName, isEmptyObject } from '../../api/utils'
import { getAlbumList, changeEnterLoading } from './store/actionCreators'

import Header from '../../baseUI/Header'
import Scroll from '../../baseUI/Scroll'
import Loading from '../../baseUI/Loading'
import MusicNote from '../../baseUI/MusicNote'
import SongsList from '../SongsList'

const Album = (props) => {
  const { history, match } = props
  const { albumList, enterLoading, playerList } = props
  const { getAlbumListData } = props

  // 顶部栏高度
  const HEADER_HEIGHT = 45

  const [title, setTitle] = useState('歌单')
  const [showStatus, setShowStatus] = useState(true)
  const [isMarquee, setIsMarquee] = useState(false) // 是否启用标题滚动

  const headRef = useRef()
  const nodeRef = useRef()
  const musicNoteRef = useRef()

  useEffect(() => {
    getAlbumListData(match.params.id)
  }, [getAlbumListData, match.params.id])

  const albumListJS = albumList.toJS()

  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])

  const handleScroll = useCallback(
    (pos) => {
      if (!pos) return
      const minScrollY = -HEADER_HEIGHT
      const percent = Math.abs(pos.y / minScrollY)
      const headerDom = headRef.current
      if (pos.y < minScrollY) {
        headerDom.style.background = style['theme-color']
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2)
        setIsMarquee(true)
        setTitle(albumListJS.name)
      } else {
        headerDom.style.background = ''
        headerDom.style.opacity = 1
        setIsMarquee(false)
        setTitle('歌单')
      }
    },
    [albumListJS]
  )

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y })
  }

  const renderTopDesc = () => (
    <TopDesc background={albumListJS.coverImgUrl}>
      <div className="background">
        <div className="filter"></div>
      </div>
      <div className="img_wrapper">
        <div className="decorate"></div>
        <img src={albumListJS.coverImgUrl} alt="" />
        <div className="play_count">
          <i className="play iconfont">&#xe885;</i>
          <span className="count">{getCount(albumListJS.playCount)}</span>
        </div>
      </div>
      <div className="desc_wrapper">
        <div className="title">{albumListJS.name}</div>
        <div className="person">
          <div className="avatar">
            <img src={albumListJS.creator.avatarUrl} alt="" />
          </div>
          <div className="name">{albumListJS.creator.nickname}</div>
        </div>
      </div>
    </TopDesc>
  )

  const renderMenu = () => (
    <Menu>
      <div>
        <i className="iconfont">&#xe6ad;</i>
        评论
      </div>
      <div>
        <i className="iconfont">&#xe86f;</i>
        点赞
      </div>
      <div>
        <i className="iconfont">&#xe62d;</i>
        收藏
      </div>
      <div>
        <i className="iconfont">&#xe606;</i>
        更多
      </div>
    </Menu>
  )

  return (
    // https://www.jianshu.com/p/49fa164b938d
    // https://reactcommunity.org/react-transition-group/css-transition
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit // 动画结束Dom消失
      onExited={history.goBack} // 在退出动画执行结束时跳转路由
      nodeRef={nodeRef} // https://cloud.tencent.com/developer/ask/sof/373453
    >
      <Container ref={nodeRef} isPlayer={playerList.toJS().length > 0}>
        <Header
          title={title}
          handleClick={handleBack}
          isMarquee={isMarquee}
          ref={headRef}
        />
        {!isEmptyObject(albumListJS) ? (
          <Scroll bounceTop={false} onScroll={(pos) => handleScroll(pos)}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              <SongsList
                showCollect={true}
                collectCount={albumListJS.subscribedCount}
                song={albumListJS.tracks}
                showBackground={true}
                musicAnimation={musicAnimation}
              ></SongsList>
            </div>
          </Scroll>
        ) : null}
        <Loading show={enterLoading} />
        <MusicNote ref={musicNoteRef} />
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => ({
  albumList: state.getIn(['album', 'albumList']),
  enterLoading: state.getIn(['album', 'enterLoading']),
  playerList: state.getIn(['player', 'playList'])
})

const mapDispatchToProps = (dispatch) => ({
  getAlbumListData(id) {
    dispatch(changeEnterLoading(true))
    dispatch(getAlbumList(id))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(memo(Album))
