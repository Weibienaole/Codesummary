import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const data = window.__SSR_DATA__;

ReactDOM.hydrate(
  <React.StrictMode>
    <App data={data} />
  </React.StrictMode>,
  document.getElementById('root')
)