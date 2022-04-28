import React from 'react'
import { render } from 'react-dom'
import { JSB_init, setDomRem } from 'zzy-javascript-devtools'

import App from './App'


// JSbridge 初始化
JSB_init()


// rem 设置
setDomRem(8)



render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
)
