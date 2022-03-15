import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  memo,
  useRef
} from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'

import style from '../../assets/global-style'

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 10001;
  width: 100%;
  height: 50px;
  /* background-color: ${style['highlight-background-color']}; */
  &.drop-enter {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  &.drop-enter-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: all 0.3s;
  }
  &.drop-exit-active {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
    transition: all 0.3s;
  }
  .text {
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: ${style['font-size-l']};
  }
`

const Toast = forwardRef((props, ref) => {
  const { text } = props
  const [show, setShow] = useState(false)
  const [timer, setTimer] = useState(null)
  const toastRef = useRef()
  // 外面组件拿函数组件ref的方法 useImperativeHandle
  useImperativeHandle(ref, () => ({
    show() {
      // timeout防抖
      if (timer) clearTimeout(timer)
      setShow(true)
      setTimer(
        setTimeout(() => {
          setShow(false)
        }, 3000)
      )
    }
  }))
  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames="drop"
      unmountOnExit
      nodeRef={toastRef}
    >
      <ToastWrapper ref={toastRef}>
        <div className="text">{text}</div>
      </ToastWrapper>
    </CSSTransition>
  )
})

export default memo(Toast)
