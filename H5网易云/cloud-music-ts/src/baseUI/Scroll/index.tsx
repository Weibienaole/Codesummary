import React, { useState, useEffect, useRef, useImperativeHandle, useMemo, forwardRef } from 'react'
import BScroll from 'better-scroll'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const Scroll = forwardRef((props: Props, ref) => {
  const { children } = props
  const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props
  const { onScroll, pullUp, pullDown } = props


  const [bScroll, setBScroll] = useState<any>()

  const scrollRef = useRef('')

  useEffect(() => {
    const scroll = new BScroll(scrollRef.current, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      },
      probeType: 3,
      // chrome 模拟滚动
      mouseWheel: true
    })
    setBScroll(scroll)
    return () => {
      setBScroll(null)
    }
  }, [])

  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })

  useEffect(() => {
    if (!onScroll || !bScroll) return
    bScroll.on('scroll', (scroll => {
      onScroll(scroll)
    }))
    return () => {
      bScroll.off('scroll')
    }
  }, [onScroll, bScroll])

  useEffect(() => {
    if (!pullUp || !bScroll) return
    bScroll.on('scrollEnd', () => {
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUp()
      }
    })
    return () => {
      bScroll.off('scrollEnd')
    }
  }, [pullUp, bScroll])

  useEffect(() => {
    if (!pullDown || !bScroll) return
    bScroll.on('scrollTop', () => {
      if (bScroll.y > 50) {
        pullDown()
      }
    })
    return () => {
      bScroll.off('scrollTop')
    }
  }, [pullDown, bScroll])

  useImperativeHandle(ref, () => ({
    refresh() {
      if (!bScroll) return
      bScroll.refresh()
      bScroll.scrollTo(0, 0)
    },
    getScroll() {
      if (!bScroll) return
      return bScroll
    }
  }))

  return (
    <Container ref={scrollRef}>
      {children}
    </Container>
  )
})

interface Props {
  children: any,
  direction?: 'vertical' | 'horizental',
  click?: boolean,
  refresh?: boolean,
  onScroll?: Function | null,
  pullUpLoading?: boolean,
  pullDownLoading?: boolean,
  pullUp?: Function | null,
  pullDown?: Function | null,
  bounceTop?: boolean,
  bounceBottom?: boolean
}

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
};

export default Scroll