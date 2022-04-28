import React from 'react'
import { useState, useEffect } from 'react'
import 'react-virtualized/styles.css'

import {Column, Table} from 'react-virtualized'
import './App.css'

import Header from './components/Header'
import SvgIcon from './components/svgIcons'

const logo = '/@assets/imgs/flower.jpg'
const logo2 = '/@assets/imgs/pppic.png'

const icons = import.meta.globEager('./assets/icons/logo-*.svg')
const iconsUrls = Object.values(icons).map((item) => {
  const fileName = item.default.split('/').pop()
  const [svgName] = fileName.split('.')
  return svgName
})
function App() {
  useEffect(() => {
    console.log(iconsUrls, 'icons')
    // const img = document.getElementById('logo') as HTMLImageElement;
    // img.src = logo;
  }, [])
  return (
    <div className="App">
      <img
        src="/@assets/imgs/flower.jpg"
        alt=""
        id="logo"
        className="App-logo"
      />
      <div className="header"></div>
      <img src={logo2} alt="" />
      <Header></Header>
      <Table></Table>
      {iconsUrls.map((item) => (
        <SvgIcon name={item} key={item} width="50" height="50" />
      ))}
      <SvgIcon name="logo-2" />
      {/* <img src="/@assets/icons/logo-2.svg" alt="" /> */}
    </div>
  )
}

export default App
