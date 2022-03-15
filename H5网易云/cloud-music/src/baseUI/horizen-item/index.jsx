import React, { useState, useEffect, memo, useRef } from 'react'
import styled from 'styled-components'
import { PropTypes } from 'prop-types'

import style from '../../assets/global-style'
import Scroll from '../Scroll'

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  > span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: gray;
    font-size: ${style['font-size-m']};
    vertical-align: middle;
  }
`
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style['font-size-m']};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style['theme-color']};
    border: 1px solid ${style['theme-color']};
    opacity: 0.8;
  }
`

const Horizen = (props) => {
  const { list, oldVal, title } = props
  const { handleClick } = props


  const CategoryRef = useRef()

  useEffect(() => {
    const categoryDom = CategoryRef.current
    let tagElems = categoryDom.querySelectorAll("span");
    let totalWidth = 0
    Array.from(tagElems).forEach((ele) => {
      totalWidth += ele.offsetWidth
    })
    categoryDom.style.width = `${totalWidth + 20}px`
  }, [])

  return (
    <Scroll direction={'horizontal'}>
      <div ref={CategoryRef}>
        <List>
          <span>{title}</span>
          {list.map((item) => (
            <ListItem
              key={item.key}
              onClick={() => handleClick(item.key)}
              className={oldVal === item.key ? 'selected' : ''}
            >
              {item.name}
            </ListItem>
          ))}
        </List>
      </div>
    </Scroll>
  )
}

Horizen.defaultProps = {
  list: [], // 列表数据
  oldVal: '', // 当前选定 item
  title: '', // 标题
  handleClick: null // 点击事件
}

Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func
}
export default memo(Horizen)
