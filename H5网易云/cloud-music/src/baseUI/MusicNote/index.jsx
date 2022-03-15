import React, {
  memo,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect
} from 'react'
import styled from 'styled-components'

import style from '../../assets/global-style'
import { prefixStyle } from '../../api/utils'

const MusicNoteContainer = styled.div`
  .icon_wrapper {
    position: fixed;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style['theme-color']};
    z-index: 1000;
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(0.62, -0.1, 0.86, 0.57);
    transform: translate3d(0, 0, 0);
    > div {
      transition: transform 1s;
    }
  }
`

const MusicNote = forwardRef((props, ref) => {
  const iconsRef = useRef()

  // 允许最多三个音符同时存在
  const ICON_MAX = 3
  const transform = prefixStyle('transform')

  const createNode = (txt) => {
    const inner = `<div class="icon_wrapper">${txt}</div>`
    const div = document.createElement('div')
    div.innerHTML = inner
    return div.firstChild
  }
  useEffect(() => {
    for (let i = 0; i < ICON_MAX; i++) {
      let node = createNode(`<div class="iconfont">&#xe642;</div>`)
      iconsRef.current.appendChild(node)
    }
    const domArray = [...iconsRef.current.children]
    domArray.forEach(item => {
      item.running = false
      item.addEventListener(
        'transitionend',
        function () {
          this.style['display'] = 'none'
          this.style[transform] = 'translate3d(0, 0, 0)'
          this.running = false
          let icon = this.querySelector('div')
          icon.style[transform] = 'translate3d(0, 0, 0)'
        },
        false
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startAnimation = ({ x, y }) => {
    for (let i = 0; i < ICON_MAX; i++) {
      const domArray = [...iconsRef.current.children]
      const item = domArray[i]
      // 找到某个空的元素进行执行动画
      if (item.running === false) {
        item.style.left = x + 'px'
        item.style.top = y + 'px'
        item.style.display = 'inline-block'
        setTimeout(() => {
          item.running = true
          item.style[transform] = 'translate3d(0, 750px, 0)'
          const icon = item.querySelector('div')
          icon.style[transform] = 'translate3d(-40px, 0, 0)'
          // clearTimeout(timer)
        }, 20)
        break;
      }
    }
  }

  useImperativeHandle(ref, () => ({
    startAnimation
  }))

  return <MusicNoteContainer ref={iconsRef}></MusicNoteContainer>
})

export default memo(MusicNote)
