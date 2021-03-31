import React, { Component, useContext } from 'react'

// const { Consumer } = React.createContext()
import {Consumer} from './demo2'
function Bs() {
  return (
    <Consumer>
      {(name) => (
        <div>
          {name} 我是 name！
          {console.log(name)}
        </div>
      )}
    </Consumer>
  )
}
export default Bs
