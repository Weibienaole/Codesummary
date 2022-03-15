import React, { memo } from 'react'
import styled, { keyframes } from 'styled-components'

import style from '../../assets/global-style'

const dance = keyframes`
  0%, 40%, 100% {
    transform: scaleY(.4);
    // 元素变换原点，以某个中心进行动画
    transform-origin: center 100%;
  }
  20% {
    transform: scaleY(1);
  }
`

const LoadingWrapper = styled.div`
  width: 100%;
  height: 10px;
  margin: auto;
  text-align: center;
  font-size: 10px;
  > div {
    background-color: ${style['theme-color']};
    display: inline-block;
    height: 100%;
    width: 1px;
    margin-right: 2px;
    animation: ${dance} 1s infinite;
  }
  > div:nth-child(2) {
    animation-delay: -0.4s;
  }
  > div:nth-child(3) {
    animation-delay: -0.6s;
  }
  > div:nth-child(4) {
    animation-delay: -0.5s;
  }
  > div:nth-child(5) {
    animation-delay: -0.2s;
  }
  >span {

  }
`

const LoadingV2 = () => {
  return (
    <LoadingWrapper>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <span> 拼命加载中...</span>
    </LoadingWrapper>
  )
}

export default memo(LoadingV2)
