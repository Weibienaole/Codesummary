import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import fib from 'virtual:fib'
import env from 'virtual:env'
import './index.css'

fib(12)

console.log(env);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
)
