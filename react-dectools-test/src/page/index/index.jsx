import React, { Component, useState, useEffect, createRef } from 'react'
import { withRouter } from 'react-router-dom'
import { devtools, ReactComponents } from 'zzy-javascript-devtools'

import './index.css'

const list = ({ i, style, data }) => {
  return (
    <div className="list" key={i} style={style}>
      <div className="til">item - {i} data</div>
      <div className="content">{data.content}</div>
    </div>
  )
}
// const setData = () => {
//   for (let i = startIdx; i <= endIdx; ++i) {
//     let data = {
//       // content:
//       //   '从服务器端下载代码到客户端本地在终端中输入svn checkout svn://localhost/mycode --username=mj --password=123 /Users/apple/Documents/code我解释下指令的意思：将服务器中mycode仓库的内容下载到/Users/apple/Documents/code目录中提交更改过的代码到服务器在步骤2中已经将服务器端的代码都下载到/Users/apple/Documents/code目录中，现在修改下里面的一些代码，然后提交到服务器打开终端，先定位到/Users/apple/Documents/code目录，输入：cd /Users/apple/Documents/code输入提交指令：svn commit -m "修改了main.m文件"这个指令会将/Users/apple/Documents/code下的所有修改都同步到服务器端，假如这次我只修改了main.文件可以看到终端的打印信息'
//       content: faker.lorem.sentences()
//     }
//     let style = {
//       height: rowHeight - 1 + 'px'
//       // transfrom: this.getTransform()
//     }
//     content.push(list({ i, style, data }))
//   }
// }
class PagePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inde: 0,
      showT: false,
      scrollTop: 0
    }
  }
  remPx = document.querySelector('html').style.fontSize.split('px')[0]
  // 单列高度
  rowHeight = Math.ceil(27.1 * this.remPx)
  // 滚动区域高度
  scrollHeight = Math.ceil(69 * this.remPx)
  // 区域内所能接受的最多列数
  scrollViewListNum = Math.ceil(this.scrollHeight / this.rowHeight)
  // 总数
  total = 1000
  listScrollRef = React.createRef()
  // 开始idx
  startIdx = 0
  // 加入buffer之后的起始idx
  originStartIdx = 0
  // 容错长度
  bufferSize = 5
  // 结束idx
  endIdx = Math.min(
    this.startIdx + this.scrollViewListNum + this.bufferSize,
    this.total - 1
  )
  componentDidMount() {
    let that = this
    // 截取url上信息
    console.log(window.location.href)
    // let url = window.location.href
    // console.log(token)
    console.log();
    devtools.JSB_appMethod('aaa')
    devtools.lazyImage()
  }
  getData() {
    let that = this
    let timer = setTimeout(() => {
      console.log('setTimeout')
      document.querySelector(
        '.container'
      ).innerHTML += `<span>${that.state.inde}</span><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>`
      that.setState({
        inde: ++that.state.inde
      })
      devtools.infinityScrolling.bol = true
      clearTimeout(timer)
    }, 1000)
  }
  listScroll(e) {
    if (e.target === this.listScrollRef.current) {
      let {
        scrollHeight,
        rowHeight,
        total,
        scrollViewListNum,
        bufferSize
      } = this
      const { scrollTop } = e.target
      let nowStartIdx = Math.floor(scrollTop / rowHeight)
      if (nowStartIdx !== this.startIdx) {
        this.startIdx = Math.max(nowStartIdx - this.bufferSize, 0)
        this.endIdx = Math.min(
          nowStartIdx + scrollViewListNum + bufferSize,
          total - 1
        )
        console.log(this.getTransform())
      }
      this.setState({ scrollTop })
    }
  }
  getTransform() {
    let { scrollTop } = this.state
    let { bufferSize, originStartIdx, rowHeight } = this
    return `translate3d(0,${
      scrollTop -
      (scrollTop % rowHeight) -
      Math.min(originStartIdx, bufferSize) * rowHeight
    }px,0)`
  }
  scrollList() {
    let content = [],
      { scrollHeight, startIdx, endIdx, rowHeight, total } = this
    for (let i = startIdx; i <= endIdx; ++i) {
      let data = {
        content:
          '从服务器端下载代码到客户端本地在终端中输入svn checkout svn://localhost/mycode --username=mj --password=123 /Users/apple/Documents/code我解释下指令的意思：将服务器中mycode仓库的内容下载到/Users/apple/Documents/code目录中提交更改过的代码到服务器在步骤2中已经将服务器端的代码都下载到/Users/apple/Documents/code目录中，现在修改下里面的一些代码，然后提交到服务器打开终端，先定位到/Users/apple/Documents/code目录，输入：cd /Users/apple/Documents/code输入提交指令：svn commit -m "修改了main.m文件"这个指令会将/Users/apple/Documents/code下的所有修改都同步到服务器端，假如这次我只修改了main.文件可以看到终端的打印信息'
        // content: faker.lorem.sentences()
      }
      let style = {
        height: rowHeight - 1 + 'px'
        // transfrom: this.getTransform()
      }
      content.push(list({ i, style, data }))
    }
    return content
  }
  render() {
    let { scrollHeight, total, rowHeight } = this
    return (
      <div className="page-wrap">
        <div className="btn" onClick={() => this.setState({ showT: true })}>
          show toast
        </div>
        {this.state.showT && (
          <div className="toastView">
            <div
              className="toastScrollBox"
              onScroll={(e) => this.listScroll(e)}
              ref={this.listScrollRef}
            >
              <div
                style={{
                  height: total * rowHeight,
                  position: 'relative',
                  zIndex: -1
                }}
              ></div>
              <div
                className="toastBox"
                style={{
                  transform: this.getTransform(),
                  position: 'absolute',
                  top: 0,
                  width: '100%'
                }}
              >
                {this.scrollList()}
              </div>
            </div>
            <div
              className="close"
              onClick={() => this.setState({ showT: false })}
            >
              close
            </div>
          </div>
        )}
        <div className="container">
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <br />
           <ReactComponents.Img
             src="https://www.babeljs.cn/img/babel.png"
             className="img"
             click={() => console.log(1, 'click')}
           ></ReactComponents.Img>
         </div>
         <ReactComponents.ScrollLoadingBar
           getMoreData={() => this.getData()}
         ></ReactComponents.ScrollLoadingBar>
        {/* <ReactComponents.TopBar title="title"></ReactComponents.TopBar> */}
      </div>
    )
  }
}

export default withRouter(PagePage)
