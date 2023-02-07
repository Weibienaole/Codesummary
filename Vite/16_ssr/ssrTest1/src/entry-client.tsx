import React from "react";
import ReactDOM from 'react-dom'
import './index.css'
import App from "./App";


// @ts-ignore
// 获取到服务端拿到的数据，存入App
const data = window.__SSR_DATA__

/*
为了激活页面的交互功能，我们需要执行 CSR 的 JavaScript 代码来进行 hydrate 操作，而客户端 hydrate 的时候需要和服务端同步预取后的数据，保证页面渲染的结果和服务端渲染一致，因此，我们刚刚注入的数据 script 标签便派上用场了。由于全局的 window 上挂载服务端预取的数据，我们可以在entry-client.tsx也就是客户端渲染入口中拿到这份数据，并进行 hydrate
*/
// 客户端入口
ReactDOM.hydrate(
  <React.StrictMode>
    <App data={data} />
  </React.StrictMode>,
  document.getElementById('root')
)