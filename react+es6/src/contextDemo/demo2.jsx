import React, { Component } from 'react'
import Bs from './demo2Child'

export const {Provider, Consumer} = React.createContext()
class As extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: 'zzy'
    }
  }
  render() {
    return (
      <Provider value={this.state.data}>
        {this.state.data}
        <Bs></Bs>
        <a href="/">back App</a>
      </Provider>
    )
  }
}
export default As
