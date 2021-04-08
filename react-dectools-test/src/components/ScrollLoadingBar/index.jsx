import React, { Component, useEffect, useState } from 'react'
import { devtools } from 'zzy-javascript-devtools'

/*
  props
    getMoreData Function 加载更多
*/

function ScrollLoadingBar({ getMoreData }) {
  let [a, setA] = useState()
  useEffect(() => {
    let that = this
    console.log(devtools.infinityScrolling, 'devtools');
    devtools.infinityScrolling(
      document.querySelector('.scrollLoadingBar'),
      () => {
        devtools.infinityScrolling.bol = false
        getMoreData()
      }
    )
    return () => devtools.infinityScrolling.closeMonitor()
  }, [])
  return (
    <div
      className="scrollLoadingBar"
      style={{ opacity: 0, width: 0, height: 0, zIndex: -1 }}
    ></div>
  )
}
export default ScrollLoadingBar
