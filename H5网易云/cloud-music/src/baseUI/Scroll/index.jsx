import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  useMemo
} from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import styled from 'styled-components'
import { debounce } from '../../api/utils'

import Loading from '../Loading'
import LoadingV2 from '../LoadingV2'

const ScrollSty = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const PullDownLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 10px;
  height: 30px;
  margin: auto;
  z-index: 100;
`

const PullUpLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`

const Scroll = forwardRef((props, ref) => {
  // 参数
  const {
    direction,
    click,
    refresh,
    bounceTop,
    bounceBottom,
    pullUpLoading,
    pullDownLoading
  } = props

  // 函数
  const { pullUp, pullDown, onScroll } = props

  // 指向需要scroll组件的ref
  const scrollRef = useRef()

  // better-scroll 实例对象
  const [bScroll, setBScroll] = useState()

  const pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300)
  }, [pullUp])
  const pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300)
  }, [pullDown])
  // const onScrollDebounce = useMemo(
  //   (el) => {
  //     return debounce(onScroll(el), 100)
  //   },
  //   [onScroll]
  // )

  useEffect(() => {
    const scroll = new BScroll(scrollRef.current, {
      scrollX: direction === 'horizontal',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      },
      // chrome 模拟滚动
      mouseWheel: true
    })
    setBScroll(scroll)
    return () => {
      setBScroll(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 获取数据之后重新刷新高度，获取最新的滚动条
  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })

  // 实例绑定scroll事件
  useEffect(() => {
    if (!onScroll || !bScroll) return
    bScroll.on('scroll', (scroll) => {
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scroll')
    }
  })

  // 上拉到底的判断
  useEffect(() => {
    if (!pullUp || !bScroll) return
    bScroll.on('scrollEnd', () => {
      // 超越临界点
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce()
      }
    })
    return () => {
      bScroll.off('scrollEnd')
    }
  }, [pullUp, pullUpDebounce, bScroll])

  // 下拉到顶的判断
  useEffect(() => {
    if (!pullDown || !bScroll) return
    bScroll.on('touchEnd', (pos) => {
      if (pos.y > 50) {
        pullDownDebounce()
      }
    })
    return () => {
      bScroll.off('touchEnd')
    }
  }, [pullDown, pullDownDebounce, bScroll])

  // 刷新scroll组件
  useImperativeHandle(ref, () => ({
    // return暴露给外部方法
    // 刷新
    refresh() {
      if (bScroll) {
        bScroll.refresh()
        bScroll.scrollTo(0, 0)
      }
    },

    // 拿到scroll实例
    getScroll() {
      if (bScroll) {
        return bScroll
      }
    }
  }))

  const pullUpLoadingSty = pullUpLoading ? { display: '' } : { display: 'none' }
  const pullDownLoadingSty = pullDownLoading
    ? { display: '' }
    : { display: 'none' }

  return (
    <ScrollSty ref={scrollRef}>
      {props.children}
      <PullDownLoading style={pullDownLoadingSty}>
        <LoadingV2 />
      </PullDownLoading>
      <PullUpLoading style={pullUpLoadingSty}>
        <Loading show={true} />
      </PullUpLoading>
    </ScrollSty>
  )
})

Scroll.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
}
Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizontal']), // 滚动的方向
  refresh: PropTypes.bool, // 是否刷新
  onScroll: PropTypes.func, // 滑动触发的回调函数
  pullUp: PropTypes.func, // 上拉加载逻辑
  pullDown: PropTypes.func, // 下拉加载逻辑
  pullUpLoading: PropTypes.bool, // 是否显示上拉 loading 动画
  pullDownLoading: PropTypes.bool, // 是否显示下拉 loading 动画
  bounceTop: PropTypes.bool, // 是否支持向上吸顶
  bounceBottom: PropTypes.bool // 是否支持向下吸底
}

export default Scroll
