import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import './index.css'
/*
  props:
    say - 文案
*/
class TopBar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="noData-component">
        <img
          src={require('./noData.png')}
          alt=""
          className="noDataPic"
        />
        <span className="say">{this.props.say}</span>
      </div>
    )
  }
}

export default withRouter(TopBar)
