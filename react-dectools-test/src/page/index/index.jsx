import React, { Component, useState, useEffect, createRef } from 'react'
import { withRouter } from 'react-router-dom'
import { devtools, ReactComponents } from 'zzy-javascript-devtools'

import './index.css'
import request from '../../utils/request'
class PagePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inde: 0,
      showT: false,
      scrollTop: 0,
      content:
        '从服务器端下载代码到客户端本地在终端中输入svn checkout svn://localhost/mycode --username=mj --password=123 /Users/apple/Documents/code我解释下指令的意思：将服务器中mycode仓库的内容下载到/Users/apple/Documents/code目录中提交更改过的代码到服务器在步骤2中已经将服务器端的代码都下载到/Users/apple/Documents/code目录中，现在修改下里面的一些代码，然后提交到服务器打开终端，先定位到/Users/apple/Documents/code目录，输入：cd /Users/apple/Documents/code输入提交指令：svn commit -m "修改了main.m文件"这个指令会将/Users/apple/Documents/code下的所有修改都同步到服务器端，假如这次我只修改了main.文件可以看到终端的打印信息'
    }
  }
  remPx = document.querySelector('html').style.fontSize.split('px')[0]
  // 单列高度
  rowHieght = Math.ceil(23 * this.remPx + (2 + 1) * this.remPx)
  // 滚动区域高度
  scrollHeight = Math.ceil(69 * this.remPx)
  // 区域内所能接受的最多列数
  scrollViewListNum = Math.ceil(this.scrollHeight / this.rowHieght)
  // 总数
  total = 10000
  listScrollRef = React.createRef()
  // 开始idx
  startIdx = 0
  // 结束idx
  endIdx = Math.min(this.startIdx + this.scrollViewListNum, this.total - 1)
  componentDidMount() {
    let that = this
    // 截取url上信息
    console.log(window.location.href)
    // let url = window.location.href
    // console.log(token)
    console.log(this.rowHieght)
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
        startIdx,
        endIdx,
        rowHieght,
        total,
        scrollViewListNum
      } = this
      const { scrollTop } = e.target
      let nowStartIdx = Math.floor(scrollTop / rowHieght)
      console.log(scrollTop, 'scrollTop')
      if (nowStartIdx !== this.startIdx) {
        this.startIdx = nowStartIdx
        this.endIdx = Math.min(nowStartIdx + scrollViewListNum, total - 1)
      }
      this.setState({ scrollTop })
    }
  }
  list({ i, style, data }) {
    return (
      <div className="list" key={i} style={style}>
        <div className="til">item - {i} data</div>
        <div className="content">{data.content}</div>
      </div>
    )
  }
  scrollList() {
    let content = [],
      { scrollHeight, startIdx, endIdx, rowHieght, total } = this
    for (let i = startIdx; i <= endIdx; ++i) {
      let data = {
        content:
          '从服务器端下载代码到客户端本地在终端中输入svn checkout svn://localhost/mycode --username=mj --password=123 /Users/apple/Documents/code我解释下指令的意思：将服务器中mycode仓库的内容下载到/Users/apple/Documents/code目录中提交更改过的代码到服务器在步骤2中已经将服务器端的代码都下载到/Users/apple/Documents/code目录中，现在修改下里面的一些代码，然后提交到服务器打开终端，先定位到/Users/apple/Documents/code目录，输入：cd /Users/apple/Documents/code输入提交指令：svn commit -m "修改了main.m文件"这个指令会将/Users/apple/Documents/code下的所有修改都同步到服务器端，假如这次我只修改了main.文件可以看到终端的打印信息'
      }
      let style = {
        top: i * rowHieght + 'px'
      }
      content.push(this.list({ i, style, data }))
    }
    return content
  }
  render() {
    let { scrollHeight, total, rowHieght } = this
    return (
      <div className="page-wrap">
        <ReactComponents.TopBar
          type="1"
          title=""
          arrowBack={() => console.log('arrowbakc')}
        ></ReactComponents.TopBar>
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
                className="toastBox"
                style={{ height: scrollHeight * total }}
              >
                {this.scrollList()}
                {/* {Array(10000).fill(null).map((item, index) => (
                  <div className="list" key={index} style={{position: 'relative'}}>
                    <div className="til">item - {index} data</div>
                    <div className="content">{this.state.content}</div>
                  </div>
                ))} */}
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
        <ReactComponents.NoData
          say={'asasasas'}
          style={{ width: '16.25rem', height: '15.69rem' }}
          src={require('./image/noData.png')}
        ></ReactComponents.NoData>
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
      </div>
    )
  }
}

// HOOK写法
/*
function Page() {
  let [pageData, setPageData] = useState(null)
  useEffect(()=>{
    console.log(window.location.href)
    // let url = window.location.href
    let url ='http://localhost:3000/?token=0ffecc644c133f97367dc7f8f1e7a72da5161d1e958af2b0e2a7f22329a04eb777f71cd2038e2e01532424ba629f8460435122bdb2990ca1a6f57cc630099f4300fbf0f2a085eb38d200108ec92783b0c6d1ca2438b7f4e8dd6f1e152add18d96b1e822336348e5df24875f77ce09bfe9ab03077d5c64652b0ef35926565b5f0b7940658857cef6c'
    if(url.slice(url.length-2, url.length) === '#/'){
      url = url.slice(0, url.length-2)
    }
    let token = null
    if (url.split('?')[1]) {
      let params = url.split('?')[1].split('&')
      for (let item of params) {
        let arr = item.split('=')
        switch (arr[0]) {
          case 'token':
            token = arr[1] || 0
            continue
          default:
            continue
        }
      }
    }
    console.log(token)
    // let obj = {
    //   u: '',

    // }
    // request(obj)
  }, [])
  return (
    <div className="page-wrap">
      <div className="container">
      </div>
    </div>
  )
}
*/

export default withRouter(PagePage)
