import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'

import style from '../../assets/global-style'

// 给动画添加补帧效果
const loading = keyframes`
  0%, 100% {
    transform: scale(0.0);
  }
  50% {
    transform: scale(1.0);
  }
`

const LoadingWrapper = styled.div`
  > div {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    margin: auto;
    width: 60px;
    height: 60px;
    opacity: 0.6;
    border-radius: 50%;
    background-color: ${style['theme-color']};
    animation: ${loading} 1.4s infinite ease-in;
  }
  > div:nth-child(2) {
    animation-delay: -0.7s;
  }
`

const Loading = ({ show }) => {
  return (
    <LoadingWrapper style={show ? { display: '' } : { display: 'none' }}>
      <div></div>
      <div></div>
    </LoadingWrapper>
  )
}

Loading.defaultProps = {
  show: true
}

Loading.propTypes = {
  show: PropTypes.bool
}

export default React.memo(Loading)
