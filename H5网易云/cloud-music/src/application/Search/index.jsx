import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import LazyLoad, { forceCheck } from 'react-lazyload'

import {
  SearchWrapper,
  SearchResultContainer,
  HotKey,
  List,
  ListItem,
  SongItem
} from './style'
import { getName } from '../../api/utils'
import { getHotKeywords, getSearchResult } from './store/actionCreators'
import { getSongDetail } from '../Player/store/actionCreators'
import SearchBox from '../../baseUI/SearchBox'
import Loading from '../../baseUI/Loading'
import Scroll from '../../baseUI/Scroll'
import MusicNote from '../../baseUI/MusicNote'

const Search = (props) => {
  const { history } = props
  const {
    hotKeywordsListImmu,
    suggestListImmu,
    songsListImmu,
    enterLoading,
    songCount
  } = props
  const {
    getHotKeywordsDispatch,
    getSearchResultDispatch,
    getSongDetailDispatch
  } = props
  // 控制动画
  const [show, setShow] = useState(false)

  const [query, setQuery] = useState('')

  const searchWrapperRef = useRef()
  const musicNoteRef = useRef()

  const suggestList = suggestListImmu.toJS()
  const songsList = songsListImmu.toJS()

  useEffect(() => {
    setShow(true)
    if (!hotKeywordsListImmu.size) getHotKeywordsDispatch()
  }, [])

  const searchBack = useCallback(() => {
    setShow(false)
  }, [])

  /*
    原因是Search 页面的handleQuery每次会因组件的重新渲染生成新的引用，导致SearchBox里的handleQueryDebounce也重新生成引用（debounce没有达到防抖的效果）。在两次输入时间差里handleQueryDebounce如果正好是两个不同的引用，两次输入都执行了父组件的handleQuery，然后newQuery发生改变，SearchBox里会检查到newQuery和query不同，再次触发setQuery，无限循环下去了。
    把Search 页面的handleQuery用useCallback包起来可以解决
   */
  const handleQuery = useCallback((val) => {
    setQuery(val)
    if (!val) return
    getSearchResultDispatch(val)
  }, [])

  const selectItem = (e, id) => {
    getSongDetailDispatch(id)
    musicNoteRef.current.startAnimation({
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    })
  }

  const renderHotKey = () => {
    const list = hotKeywordsListImmu?.toJS() || []
    return (
      <ul>
        {list.map((item) => (
          <li
            className="item"
            key={item.first}
            onClick={() => setQuery(item.first)}
          >
            <span>{item.first}</span>
          </li>
        ))}
      </ul>
    )
  }

  const renderSingers = () => {
    const list = suggestList?.artists || []
    if (!list.length) return
    return (
      <List>
        <h1 className="title"> 相关歌手 </h1>
        {list.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + '' + index}
              onClick={() => history.push(`/singers/${item.id}`)}
            >
              <div className="imgWrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require('./singer.png')}
                      alt="singer"
                    />
                  }
                >
                  <img
                    src={item.picUrl}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name"> 歌手: {item.name}</span>
            </ListItem>
          )
        })}
      </List>
    )
  }

  const renderAlbum = () => {
    const list = suggestList?.playlists || []
    if (!list.length) return
    return (
      <List>
        <h1 className="title">相关歌单</h1>
        {list.map((item, index) => (
          <ListItem
            key={item.accountId + '' + index}
            onClick={() => history.push(`/album/${item.id}`)}
          >
            <div className="imgWrapper">
              <LazyLoad
                placeholder={
                  <img
                    width="100%"
                    height="100%"
                    src={require('./music.png')}
                    alt="music"
                  />
                }
              >
                <img
                  src={item.coverImgUrl}
                  width="100%"
                  height="100%"
                  alt="music"
                />
              </LazyLoad>
            </div>
            <span className="name">歌单：{item.name}</span>
          </ListItem>
        ))}
      </List>
    )
  }

  const renderSongs = () => {
    return (
      <SongItem style={{ paddingLeft: '20px' }}>
        {songsList.map((item) => (
          <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
            <div className="info">
              <span>{item.name}</span>
              <span>
                {getName(item.artists)} - {item.album.name}
              </span>
            </div>
          </li>
        ))}
      </SongItem>
    )
  }

  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={history.goBack}
      nodeRef={searchWrapperRef}
    >
      <SearchWrapper ref={searchWrapperRef}  play={songCount}>
        <div className="searchBoxWrapper">
          <SearchBox
            newQuery={query}
            back={searchBack}
            handleQuery={handleQuery}
          />
          <SearchResultContainer show={!query}>
            <Scroll>
              <div>
                <HotKey>
                  <h1 className="title">热门搜索</h1>
                  {renderHotKey()}
                </HotKey>
              </div>
            </Scroll>
          </SearchResultContainer>
          <SearchResultContainer show={query}>
            {/* 滚动时时刻更新懒加载位置，保证图片懒加载正常 */}
            <Scroll onScroll={forceCheck}>
              <div>
                {renderSingers()}
                {renderAlbum()}
                {renderSongs()}
              </div>
            </Scroll>
          </SearchResultContainer>
        </div>
        <Loading show={enterLoading} />
        <MusicNote ref={musicNoteRef} />
      </SearchWrapper>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => ({
  hotKeywordsListImmu: state.getIn(['search', 'hotKeywordsList']),
  suggestListImmu: state.getIn(['search', 'suggestList']),
  songsListImmu: state.getIn(['search', 'songsList']),
  enterLoading: state.getIn(['search', 'enterLoading']),
  songCount: state.getIn(['player', 'playList']).size
})

const mapDispatchToProps = (dispatch) => ({
  getHotKeywordsDispatch() {
    dispatch(getHotKeywords())
  },
  getSearchResultDispatch(keywords) {
    dispatch(getSearchResult(keywords))
  },
  getSongDetailDispatch(id) {
    dispatch(getSongDetail(id))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(withRouter(Search)))
