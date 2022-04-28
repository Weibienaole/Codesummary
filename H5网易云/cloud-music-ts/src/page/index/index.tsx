import { useState, useEffect, ReactElement, memo } from 'react'
import { withRouter, NavLink } from 'react-router-dom'

import { Top, Tab, TabItem } from './style'
import './d'



const Home = (props): ReactElement => {
  const { children } = props
  return (
    <div id="homePage_wrap">
      <Top>
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">music cloud ts</span>
        <span className="iconfont search">&#xe62b;</span>
      </Top>
      <Tab>
        <NavLink to='/home/recommend' activeClassName='selected'><TabItem><span>推荐</span></TabItem></NavLink>
        <NavLink to='/home/singers' activeClassName='selected'><TabItem><span>歌手</span></TabItem></NavLink>
        <NavLink to='/home/rank' activeClassName='selected'><TabItem><span>排行榜</span></TabItem></NavLink>
      </Tab>
      {children}
    </div>
  )
}

export default withRouter(memo(Home))
