import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { forceCheck } from 'react-lazyload'

import * as actionCreators from './store/actionCreators'
import Slider from '../../components/Slider'
import RecommendList from '../../components/RecommendList'
import Scroll from '../../baseUI/Scroll'
import Loading from '../../baseUI/Loading'
import { renderRoutes } from 'react-router-config'

const Content = styled.div`
  position: fixed;
  top: 90px;
  bottom: ${props => props.isPlayer ? '60px' : '0'};
  width: 100%;
`

const Recommend = (props) => {
  const { bannerList, recommendList, enterLoading, playerList } = props

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props


  useEffect(() => {
    if (!bannerList.size) {
      getBannerDataDispatch()
    }
  }, [bannerList.size, getBannerDataDispatch])
  useEffect(() => {
    if (!recommendList.size) {
      getRecommendListDataDispatch()
    }
  }, [recommendList.size, getRecommendListDataDispatch])

  const bannerListJs = bannerList?.toJS() || []
  const recommendListJs = recommendList?.toJS() || []

  return (
    <Content isPlayer={playerList.toJS().length > 0}>
      <Scroll onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJs} />
          <RecommendList recommendList={recommendListJs} />
        </div>
      </Scroll>
      {enterLoading ? <Loading></Loading> : null}
      {renderRoutes (props.route.routes)}
    </Content>
  )
}

// 映射redux全局的state到props中
const mapStateToProps = (state) => ({
  // getIn: 对深层嵌套的数组，对象取值, [a, b, c]
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn(['recommend', 'enterLoading']),
  playerList: state.getIn(['player', 'playList'])
})

// 映射dispatch到props中
const mapDispatchToProps = (dispatch) => ({
  getBannerDataDispatch() {
    dispatch(actionCreators.getBannerList())
  },
  getRecommendListDataDispatch() {
    dispatch(actionCreators.getRecommendList())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Recommend))
