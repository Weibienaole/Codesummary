import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import AppMethods from '../../utils/appInteractive'
import './index.css'

/*
  props:
    type
      0 - 黑色主题
      1 - 白色
    title  标题
    app 
      true - app交互事件进行返回
      false - 页面内返回
    noArrow
      true - 隐藏箭头
      false - 显示
*/
class TopBar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    console.log(this.props.app, 'app');
    return (
      <div className="topBar-component">
        {!this.props.noArrow && <img
          src={require(`${this.props.type === '0' ? './image/backArrow_black.png' : './image/backArrow.png'}`)}
          alt=""
          className="arrow"
          onClick={() => this.props.app ? AppMethods('closePage') : this.props.history.goBack(-1)}
        />}
        <span className="topBarTil" style={{color: this.props.type === '0' ? '#000' : '#fff'}}>{this.props.title}</span>
      </div>
    )
  }
}

export default withRouter(TopBar)
