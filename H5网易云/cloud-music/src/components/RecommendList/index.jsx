import React from 'react'
import LazyLoad from 'react-lazyload'
import { withRouter } from 'react-router-dom'

import { getCount } from '../../api/utils'
import { ListWrapper, List, ListItem } from './style'

const RecommendList = (props) => {
  const { recommendList } = props
  const enterDetail = id => {
    props.history.push(`/recommend/${id}`);
  }

  return (
    <div id="RecommendList_component">
      <ListWrapper>
        <h1 className="title">推荐歌单</h1>
        <List>
          {recommendList.map((item, index) => (
            <ListItem key={index} onClick={() => enterDetail(item.id)}>
              <div className="img_wrapper">
                <div className="decorate"></div>
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
                  {/* 参数可以缩小图片大小 */}
                  <img
                    src={item.picUrl + '?param=300*300'}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
                <div className="play_count">
                  <i className="iconfont play">&#xe885;</i>
                  <span className="count">{getCount(item.playCount)}</span>
                </div>
              </div>
              <div className="desc">{item.name}</div>
            </ListItem>
          ))}
        </List>
      </ListWrapper>
    </div>
  )
}

export default React.memo(withRouter(RecommendList))
