import React, { memo, useEffect, useRef, useState } from 'react'

import { prefixStyle } from '../../api/utils'

import { ProgressBarContainer } from './style'


const ProgressBar = (props) => {
  const { percent } = props
  const { percentChange } = props

  const [touch, setTouch] = useState({})

  const progressBarRef = useRef()
  const progressRef = useRef()
  const progressBtnRef = useRef()

  const progressBtnWidth = -7
  const transform = prefixStyle('transform')

  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      const barWidth = progressBarRef.current.clientWidth
      const currentWid = percent * barWidth
      _offset(currentWid)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent])

  const progressTouchStart = (e) => {
    const startTouch = {}
    startTouch.initiated = true //initial 为 true 表示滑动动作开始了
    startTouch.startX = e.touches[0].pageX // 滑动开始时横向坐标
    startTouch.left = progressRef.current.clientWidth // 当前progress长度
    setTouch(startTouch)
  }

  const progressTouchMove = (e) => {
    if (!touch.initiated) return
    // 滑动距离
    const deltaX = e.touches[0].pageX - touch.startX
    // 进度条总长度
    const barWidth = progressBarRef.current.clientWidth - progressBtnWidth
    // min(min(最小距离, 滑动距离), 进度条总长度)  不小于0,不大于总长度
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth)
    _offset(offsetWidth)
  }

  const progressTouchEnd = (e) => {
    const endTouch = JSON.parse(JSON.stringify(touch))
    endTouch.initiated = false
    setTouch(endTouch)
    _changePercent()
  }

  const progressClick = (e) => {
    // 获取 progressBarRef 在视图中的位置数据
    const rect = progressBarRef.current.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    _offset(offsetWidth)
    _changePercent()
  }

  const _changePercent = () => {
    const barWidth = progressBarRef.current.clientWidth - progressBtnWidth
    const precent = progressRef.current.clientWidth / barWidth
    percentChange(precent)
  }

  // 进度条偏移
  const _offset = (w) => {
    progressRef.current.style.width = `${w}px`
    progressBtnRef.current.style[transform] = `translate3d(${w}px, 0, 0)`
  }

  return (
    <ProgressBarContainer>
      <div className="bar-inner" ref={progressBarRef} onClick={progressClick}>
        <div className="progress" ref={progressRef}></div>
        <div
          className="progress-btn-wrapper"
          ref={progressBtnRef}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarContainer>
  )
}

export default (ProgressBar)
