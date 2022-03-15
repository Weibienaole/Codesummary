import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { withRouter } from 'react-router-dom'

import { getRankList } from './store'
import { filterIndex } from '../../api/utils'
import { Conatiner, List, ListItem, SongList, EnterLoading } from './style'
import Loading from '../../baseUI/Loading'
import Scroll from '../../baseUI/Scroll'

const Rank = (props) => {
  const { route, history } = props
  const { rankList, enterLoading, playerList } = props
  const { getRankListData } = props
  useEffect(() => {
    getRankListData()
  }, [])

  let officalList = []
  let golbalList = []
  const rankListJS = rankList.toJS()
  if (rankListJS.length) {
    const filterIdx = filterIndex(rankListJS)
    officalList = rankListJS.slice(0, filterIdx)
    golbalList = rankListJS.slice(filterIdx)
  }

  const renderRankList = (list, isGlobal) => {
    return (
      <List isGlobal={isGlobal}>
        {list.map((list) => (
          <ListItem
            key={list.id}
            isGlobal={isGlobal}
            onClick={() => history.push(`/rank/${list.id}`)}
          >
            <div className="img_wrapper">
              <img src={list.coverImgUrl} alt="" />
              <div className="decorate" />
              <span className="update_frequecy">{list.updateFrequency}</span>
            </div>
            {renderSongList(list.tracks)}
          </ListItem>
        ))}
      </List>
    )
  }

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {list.map((item, index) => (
          <li key={index}>
            {index + 1}.{item.first} - {item.second}
          </li>
        ))}
      </SongList>
    ) : (
      ''
    )
  }

  return (
    <Conatiner isPlayer={playerList.toJS().length > 0}>
      <Scroll>
        <div>
          <h1 className="offical">官方榜</h1>
          {renderRankList(officalList)}
          <h1 className="global">全球榜</h1>
          {renderRankList(golbalList, true)}
          {enterLoading && (
            <EnterLoading>
              <Loading></Loading>
            </EnterLoading>
          )}
        </div>
      </Scroll>
      {/* 渲染子集页面 */}
      {renderRoutes(route.routes)}
    </Conatiner>
  )
}

const mapStateToProps = (state) => ({
  rankList: state.getIn(['rank', 'rankList']),
  enterLoading: state.getIn(['rank', 'enterLoading']),
  playerList: state.getIn(['player', 'playList'])
})

const mapDispatchToProps = (dispatch) => ({
  getRankListData() {
    dispatch(getRankList())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(withRouter(Rank)))
