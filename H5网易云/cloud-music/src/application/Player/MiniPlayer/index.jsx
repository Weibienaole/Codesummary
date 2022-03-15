import React, { memo, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { MiniPlayerContainer } from './style'
import { getName } from '../../../api/utils'

import ProgressCircle from '../../../baseUI/ProgressCircle'

const MiniPlayer = (props) => {
  const { song, fullScreen, playing, percent } = props
  const { toggleFullScreen, clickPlaying, toggleShowPlayList } = props

  const miniPlayerRef = useRef()

  const handleToggleShowPlayList = (e) => {
    e.stopPropagation()
    toggleShowPlayList(true)
  }
  return (
    <CSSTransition
      classNames="mini"
      timeout={400}
      in={!fullScreen}
      nodeRef={miniPlayerRef}
      onEnter={() => {
        miniPlayerRef.current.style.display = 'flex'
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = 'none'
      }}
    >
      <MiniPlayerContainer
        ref={miniPlayerRef}
        onClick={() => toggleFullScreen(true)}
      >
        <div className="icon">
          <div className="imgWrapper">
            <img
              src={song.al.picUrl}
              height={40}
              width={40}
              alt="img"
              className={`play ${playing ? '' : 'pause'}`}
            />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
            {playing ? (
              <i
                className="icon-mini iconfont icon-pause"
                onClick={(e) => clickPlaying(e, false)}
              >
                &#xe650;
              </i>
            ) : (
              <i
                className="icon-mini iconfont icon-play"
                onClick={(e) => clickPlaying(e, true)}
              >
                &#xe61e;
              </i>
            )}
          </ProgressCircle>
        </div>
        <div className="control">
          <i className="iconfont" onClick={handleToggleShowPlayList}>&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default memo(MiniPlayer)
