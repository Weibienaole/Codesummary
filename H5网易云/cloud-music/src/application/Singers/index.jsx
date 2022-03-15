import React, { useEffect, useContext } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import LazyLoad, { forceCheck } from 'react-lazyload'

import { NavContainer, ListContainer, List, ListItem } from './style'
import Horizen from '../../baseUI/horizen-item'
import Scroll from '../../baseUI/Scroll'
import Loading from '../../baseUI/Loading'
import * as actionCreators from './store/actionCreators'
import {
  CategoryTypeContext,
  CHANGE_CATEGORY,
  CHANGE_CATEGORY2,
  CHANGE_ALPHA
} from './CategoryType'


const categoryTypes = [
  {
    name: '全部',
    key: '-1'
  },
  {
    name: '男歌手',
    key: '1'
  },
  {
    name: '女歌手',
    key: '2'
  },
  {
    name: '组合/乐队',
    key: '3'
  }
]
const categoryTypes2 = [
  {
    name: '全部',
    key: '-1'
  },
  {
    name: '华语',
    key: '7'
  },
  {
    name: '欧美',
    key: '96'
  },
  {
    name: '日本',
    key: '8'
  },
  {
    name: '韩国',
    key: '16'
  },
  {
    name: '其他',
    key: '0'
  }
]

// 歌手首字母
const alphaTypes = [
  {
    key: 'A',
    name: 'A'
  },
  {
    key: 'B',
    name: 'B'
  },
  {
    key: 'C',
    name: 'C'
  },
  {
    key: 'D',
    name: 'D'
  },
  {
    key: 'E',
    name: 'E'
  },
  {
    key: 'F',
    name: 'F'
  },
  {
    key: 'G',
    name: 'G'
  },
  {
    key: 'H',
    name: 'H'
  },
  {
    key: 'I',
    name: 'I'
  },
  {
    key: 'J',
    name: 'J'
  },
  {
    key: 'K',
    name: 'K'
  },
  {
    key: 'L',
    name: 'L'
  },
  {
    key: 'M',
    name: 'M'
  },
  {
    key: 'N',
    name: 'N'
  },
  {
    key: 'O',
    name: 'O'
  },
  {
    key: 'P',
    name: 'P'
  },
  {
    key: 'Q',
    name: 'Q'
  },
  {
    key: 'R',
    name: 'R'
  },
  {
    key: 'S',
    name: 'S'
  },
  {
    key: 'T',
    name: 'T'
  },
  {
    key: 'U',
    name: 'U'
  },
  {
    key: 'V',
    name: 'V'
  },
  {
    key: 'W',
    name: 'W'
  },
  {
    key: 'X',
    name: 'X'
  },
  {
    key: 'Y',
    name: 'Y'
  },
  {
    key: 'Z',
    name: 'Z'
  },
  {
    key: '0',
    name: '#'
  }
]

const Singers = (props) => {
  const { history, route } = props
  const {
    singerList,
    enterLoading,
    pullUpLoading,
    pullDownLoading,
    pageCount,
    playerList
  } = props
  const {
    getHotSingerListDataDispatch,
    updateDispatch,
    pullUpRefreshDispatch,
    pullDownRefreshDispatch
  } = props

  // 获取到上文数据
  const { data, dispatch } = useContext(CategoryTypeContext)
  const { category, category2, alpha } = data.toJS()

  useEffect(() => {
    if (!singerList.size) {
      getHotSingerListDataDispatch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdateCategory = (key, val) => {
    let obj = {
      category,
      category2,
      alpha
    }
    obj[key] = obj[key] === val ? '' : val

    let setMethods = {
      category: CHANGE_CATEGORY,
      category2: CHANGE_CATEGORY2,
      alpha: CHANGE_ALPHA
    }
    // 在更改时dispatch发送type及修改的内容，完成同步
    dispatch({ type: setMethods[key], data: obj[key] })
    updateDispatch({ ...obj })
  }

  const handlePullUp = () => {
    pullUpRefreshDispatch(pageCount, category, category2, alpha)
  }

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, category2, alpha)
  }

  const singerDetail = (id) => {
    history.push(`/singers/${id}`)
  }

  const renderSingerList = () => {
    return (
      <List>
        {singerListJS.map((item, index) => (
          <ListItem key={item.id + '' + index} onClick={() => singerDetail(item.id)}>
            <div className="img_wrapper">
              <LazyLoad
                placeholder={
                  <img
                    width="100%"
                    height="100%"
                    alt="music"
                    src={require('./singer.png')}
                  />
                }
              >
                <img
                  src={`${item.picUrl}?param=300x300`}
                  width="100%"
                  height="100%"
                  alt="music"
                />
              </LazyLoad>
            </div>
            <span className="name">{item.name}</span>
          </ListItem>
        ))}
      </List>
    )
  }

  const singerListJS = singerList ? singerList.toJS() : []
  return (
    <NavContainer>
      <Horizen
        list={categoryTypes}
        title={'分类-1:'}
        handleClick={(val) => handleUpdateCategory('category', val)}
        oldVal={category}
      ></Horizen>
      <Horizen
        list={categoryTypes2}
        title={'分类-2:'}
        handleClick={(val) => handleUpdateCategory('category2', val)}
        oldVal={category2}
      ></Horizen>
      <Horizen
        list={alphaTypes}
        title={'首字母:'}
        handleClick={(val) => handleUpdateCategory('alpha', val)}
        oldVal={alpha}
      ></Horizen>
      <ListContainer isPlayer={playerList.toJS().length > 0}>
        <Scroll
          direction={'vertical'}
          onScroll={forceCheck}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          pullUp={() => handlePullUp()}
          pullDown={() => handlePullDown()}
        >
          {renderSingerList()}
        </Scroll>
        <Loading show={enterLoading} />
      </ListContainer>
      {renderRoutes(route.routes)}
    </NavContainer>
  )
}

const mapStateToProps = (state) => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount']),
  playerList: state.getIn(['player', 'playList']),
})

const mapDispatchToProps = (dispatch) => ({
  // 获取热门歌手列表
  getHotSingerListDataDispatch() {
    dispatch(actionCreators.getHotSingerList())
  },
  // 根据分类，更新列表
  updateDispatch({ category, category2, alpha }) {
    dispatch(actionCreators.changeEnterLoading(true))
    dispatch(actionCreators.changePageCount(0))
    if (category || category2 || alpha) {
      dispatch(actionCreators.getSingerList(category, category2, alpha))
    } else {
      dispatch(actionCreators.getHotSingerList())
    }
  },
  // 上拉到底
  pullUpRefreshDispatch(count, type, area, initial) {
    dispatch(actionCreators.changePullUpLoading(true))
    if (type || area) {
      // no hot
      dispatch(actionCreators.getMoreSingerList(count + 1, type, area, initial))
    } else {
      dispatch(actionCreators.getMoreHotSingerList(count + 1))
    }
  },
  // 下拉到顶
  pullDownRefreshDispatch(type, area, initial) {
    dispatch(actionCreators.changePullDownLoading(true))
    dispatch(actionCreators.changePageCount(0))
    if (type || area) {
      // no hot
      dispatch(actionCreators.getSingerList(type, area, initial))
    } else {
      dispatch(actionCreators.getHotSingerList())
    }
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(withRouter(Singers)))
