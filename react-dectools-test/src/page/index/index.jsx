import React, { Component, useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { devtools, ReactComponents } from 'zzy-javascript-devtools'

import './index.css'
import request from '../../utils/request'
class PagePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inde: 0
    }
  }
  componentDidMount() {
    let that = this
    // 截取url上信息
    console.log(window.location.href)
    // let url = window.location.href
    // console.log(token)
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
  render() {
    return (
      <div className="page-wrap">
        asas
        <ReactComponents.TopBar
          type="1"
          title=""
          rigTxt="计票规则"
        ></ReactComponents.TopBar>
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
