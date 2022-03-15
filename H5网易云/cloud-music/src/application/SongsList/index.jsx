import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { SongList, SongItem } from './style'
import { getCount, getName } from '../../api/utils'
import {
  changePlayList,
  changeSequencePlayList,
  changeCurrentIndex
} from '../Player/store/actionCreators'

const SongsList = (props) => {
  const { song, collectCount, showCollect, showBackground } = props
  const { musicAnimation } = props
  const {
    changePlayListDispatch,
    changeCurrentIndexDispatch,
    changeSequencePlayListDispatch
  } = props

  const playSong = (e, index) => {
    changePlayListDispatch(song)
    changeSequencePlayListDispatch(song)
    changeCurrentIndexDispatch(index)
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY)
  }

  const songList = (list) => {
    let res = []
    for (let i in list) {
      let item = list[i]
      res.push(
        <li key={i} onClick={(e) => playSong(e, i)}>
          <span className="index">{+i + 1}</span>
          <div className="info">
            <span className="name">{item.name}</span>
            <span>
              {item.ar ? getName(item.ar) : getName(item.artists)} -{' '}
              {item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res
  }

  return (
    <SongList showBackground={showBackground}>
      <div className="first_line">
        <div className="play_all">
          <i className="iconfont">&#xe6e3;</i>
          <span>
            播放全部
            <span className="name">(共 {song.length} 首)</span>
          </span>
        </div>
        {showCollect && (
          <div className="add_list">
            <i className="iconfont">&#xe62d;</i>
            <span>收藏({getCount(collectCount)})</span>
          </div>
        )}
      </div>
      <SongItem>{songList(song)}</SongItem>
    </SongList>
  )
}

SongsList.defaultProps = {
  song: [],
  collectCount: 0,
  showBackground: true,
  showCollect: false
}

SongsList.propTypes = {
  song: PropTypes.array,
  collectCount: PropTypes.number,
  showBackground: PropTypes.bool,
  showCollect: PropTypes.bool
}

const mapDispatchToProps = (dispatch) => ({
  changePlayListDispatch(songs) {
    dispatch(changePlayList(songs))
  },
  changeSequencePlayListDispatch(songs) {
    dispatch(changeSequencePlayList(songs))
  },
  changeCurrentIndexDispatch(index) {
    dispatch(changeCurrentIndex(index))
  }
})

export default connect(null, mapDispatchToProps)(memo(SongsList))
