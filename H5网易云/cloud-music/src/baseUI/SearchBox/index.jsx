import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import style from '../../assets/global-style'
import { debounce } from '../../api/utils'

const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20px 0 6px;
  width: 100%;
  height: 40px;
  background-color: ${style['theme-color']};
  .icon-back {
    font-size: 24px;
    color: ${style['font-color-light']};
  }
  .queryInp {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: ${style['theme-color']};
    color: ${style['highlight-background-color']};
    font-size: ${style['font-size-m']};
    outline: none;
    border: none;
    border-bottom: 1px solid ${style['border-color']};
    &::placeholder {
      color: ${style['font-color-light']};
    }
  }
  .icon-delete {
    font-size: 16px;
    color: ${style['background-color']};
  }
`

const SearchBox = (props) => {
  // 新关键词
  const { newQuery } = props
  // 有关新关键词的请求处理
  const { handleQuery } = props

  const [query, setQuery] = useState('')

  const queryRef = useRef()

  const clearIconDisplayStyle = query
    ? { display: 'block' }
    : { display: 'none' }

  useEffect(() => {
    queryRef && queryRef.current.focus()
  }, [])

  useEffect(() => {
    if (newQuery !== query) {
      setQuery(newQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newQuery])

  // 搜索栏变化
  const handleChange = (e) => {
    setQuery(e.currentTarget.value)
  }

  // 防抖
  const debounceHandleChange = useMemo(() => {
    return debounce(handleQuery, 500)
  }, [handleQuery])

  useEffect(() => {
    debounceHandleChange(query)
  }, [debounceHandleChange, query])

  // 清空搜索框
  const clearQuery = () => {
    setQuery('')
    queryRef && queryRef.current.focus()
  }
  return (
    <SearchBoxWrapper>
      <i className="iconfont icon-back" onClick={() => props.back()}>
        &#xe655;
      </i>
      <input
        type="text"
        className="queryInp"
        ref={queryRef}
        value={query}
        onChange={handleChange}
        placeholder='搜索歌曲、歌手、专辑'
      />
      <i
        className="iconfont icon-delete"
        onClick={clearQuery}
        style={clearIconDisplayStyle}
      >
        &#xe600;
      </i>
    </SearchBoxWrapper>
  )
}

export default memo(SearchBox)
