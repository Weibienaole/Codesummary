import axios from 'axios'
// import React, {Component} from 'react'
import { Toast } from 'antd-mobile'

// 移动端显示vConsole
// import vConsoleLog from '../../node_modules/vconsole/dist/vconsole.min.js'
// 正式隐藏
// const selfLog = new vConsoleLog()
function request({ u, data = {}, token = null}) {
  Toast.loading('加载中...', 30, ()=>{
    Toast.hide()
    Toast.fail('加载失败，请重试', 2)
    return 
  })
  // let url = `https://testylmycn.klzhibo.com/${u}.do?token=&time=&sign=`
  let url = `https://testmallapi.klzhibo.com/${u}.do?token=${token}&time=&sign=`
  return new Promise((reslove, reject) => {
    axios
      .post(url, data)
      .then(function(res) {
        if (res.data.code === 0) {
          Toast.hide()
          reslove(res.data.body)
        } else {
          Toast.hide()
          Toast.offline(res.data.msg, 5)
          reject(res)
        }
      })
      .catch(function(err) {
        Toast.hide()
        Toast.fail(err.msg || '加载失败，请重试', 5)
        reject(err)
      })
  })
}
export default request
