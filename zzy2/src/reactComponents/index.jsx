import Devtools from '../devTools'
import React, { Component, useState, useEffect } from 'react'
import './index.css'

// function selfRequire(d){
//   const s = require(d)
//   console.log(d ,s);
//   return s
//   // return require(d).default || require(d)
// }

const devtools = new Devtools()

// 无限滚动触发块，直接链接触发事件即可
// 需要在触发事件内结束时 赋值 devtools.infinityScrolling.bol = true
/*
  props
    getMoreData Function 加载更多
*/

// HOOK报错，暂不启用
// function ScrollLoadingBar({ getMoreData }) {
//   let [nomarl, nomarlA] = useState()
//   useEffect(() => {
//     let that = this
//     devtools.infinityScrolling(
//       document.querySelector('.scrollLoadingBar'),
//       () => {
//         devtools.infinityScrolling.bol = false
//         getMoreData()
//       }
//     )
//     return () => devtools.infinityScrolling.closeMonitor()
//   }, [])
//   return (
//     <div
//       className="scrollLoadingBar"
//       style={{ opacity: 0, width: 0, height: 0, zIndex: -1 }}
//     >{nomarl}</div>
//   )
// }

class ScrollLoadingBar extends Component {
  componentDidMount() {
    devtools.infinityScrolling(
      document.querySelector('.scrollLoadingBar'),
      () => {
        devtools.infinityScrolling.bol = false
        this.props.getMoreData()
      }
    )
  }
  componentWillUnmount() {
    devtools.infinityScrolling.closeMonitor()
  }
  render() {
    return (
      <div
        className="scrollLoadingBar"
        style={{ opacity: 0, width: '1px', height: '1px', zIndex: -1 }}
      ></div>
    )
  }
}

/*
 错误边界
  1.请在App.js中用此组件将 Route组件包裹即可展示错误之后的UI信息
  2.它在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误
  3.无法捕获 事件处理，异步代码等错误
*/

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false
    }
  }
  static getDerivedStateFromError(error) {
    console.log(error, '更新state 使下一次的UI是降级后的UI')
    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo, '将报错上传至服务器')
  }
  render() {
    if (this.state.hasError)
      return (
        <div style={{ fontSize: '2.5rem', color: 'red' }}>
          Something was wrong, please open the console to check the printing, or
          contact the Developer.
        </div>
      )
    return this.props.children
  }
}

/**
 * 此组件用于图片懒加载，配合 zzy-javascript-devtools -> devtools.lazyImage() 方法使用
 * 必须等待加载目标的 data-src 属性赋值完毕，再执行此方法
 * @param {String} className 赋予的类名
 * @param {String} src 目标地址
 * @param {Function} click 具有点击事件能力
 *
 */
function Img({ className, src, click }) {
  return (
    <img onClick={()=> click && click()} src="" data-src={src.default || src} alt="" className={className} />
  )
}

/*
  无数据显示组件
  props:
    say - 文案
    style - 样式 就像给普通标签写样式一样添加style即可
    src - 图片地址
*/
class NoData extends Component {
  render() {
    return (
      <div className="noData-component_zzyDevtools">
        <img
          style={this.props.style}
          src={this.props.src.default || this.props.src}
          alt=""
          className="noDataPic"
        />
        <span className="say">{this.props.say}</span>
      </div>
    )
  }
}

/*
  顶部栏(kl标准)
  props:
    type
      0 - 黑色主题
      1 - 白色
      不传  默认为白色主题，背景为空(透明)
    noArrow
      true - 隐藏箭头
      false - 显示
    arrowBack 返回事件
    title  标题
    rigTxt 右侧文字 不传则隐藏
    clickRigTxt 右侧点击事件
*/
class TopBar extends Component {
  render() {
    let arrowSvg = require(`${
      this.props.type == '0'
        ? './image/backArrow_black.svg'
        : './image/backArrow.svg'
    }`)
    return (
      <div
        className="topBar-component_zzyDevtools"
        style={{
          background:
            this.props.type == 0
              ? '#fff'
              : this.props.type == 1
              ? '#000'
              : 'none'
        }}
      >
        {!this.props.noArrow && (
          <img
            src={arrowSvg.default || arrowSvg}
            alt=""
            className="arrow"
            onClick={() => this.props.arrowBack()}
          />
        )}
        <span
          className="topBarTil"
          style={{ color: this.props.type === '0' ? '#000' : '#fff' }}
        >
          {this.props.title}
        </span>
        {this.props.rigTxt && (
          <span
            className="rigTxt"
            style={{ color: this.props.type === '0' ? '#000' : '#fff' }}
            onClick={() => this.props.clickRigTxt()}
          >
            {this.props.rigTxt}
          </span>
        )}
      </div>
    )
  }
}

export { ScrollLoadingBar, ErrorBoundary, Img, NoData, TopBar }
