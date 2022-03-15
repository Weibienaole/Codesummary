import React, { memo } from 'react'
import styled from 'styled-components'

import style from '../../assets/global-style'

const CircleWrapper = styled.div`
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: ${style['theme-color-shadow']};
    }
    &.progress-bar {
      stroke: ${style['theme-color']};
      transform: scale(0.9) rotate(-90deg);
    }
  }
`

const ProgressCircle = (props) => {
  // 大小，进度
  const { radius, percent } = props
  // 背景周长
  const dashArray = Math.PI * 100
  // 没有高亮的部分，剩下高亮的就是进度
  const dashOffset = (1 - percent) * dashArray

  return (
    <CircleWrapper>
      <svg
        width={radius}
        height={radius}
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="progress-background"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
        ></circle>
        {/* https://www.cnblogs.com/daisygogogo/p/11044353.html */}
        <circle
          className="progress-bar"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        ></circle>
      </svg>
      {props.children}
    </CircleWrapper>
  )
}

export default memo(ProgressCircle)
