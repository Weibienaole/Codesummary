import React, { forwardRef } from 'react'
import PorpTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import style from '../../assets/global-style'

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  padding: 5px 10px;
  padding-top: 0;
  height: 40px;
  width: 100%;
  z-index: 100;
  display: flex;
  line-height: 40px;
  color: ${style['font-color-light']};
  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }
  h1 {
    font-weight: 700;
    font-size: ${style['font-size-l']};
  }
`

const marquee = keyframes`
  from{
    transform: translate(100%, 0);
  }
  to {
    transform: translate(-100%, 0);
  }
`

const Marquee = styled.div`
  height: 40px;
  width: 100%;
  overflow: hidden;
  position: relative;
  white-space: nowrap;
  .title {
    /* position: absolute; */
    animation: ${marquee} 10s linear infinite;
  }
`

const Header = forwardRef((props, ref) => {
  const { handleClick, title, isMarquee } = props
  return (
    <HeaderContainer ref={ref}>
      <i className="back iconfont" onClick={handleClick}>
        &#xe655;
      </i>
      {isMarquee ? (
        <Marquee>
          <h1 className="title">{title}</h1>
        </Marquee>
      ) : (
        <h1 className="title">{title}</h1>
      )}
    </HeaderContainer>
  )
})

Header.defaultProps = {
  handleClick: () => {},
  title: '',
  isMarquee: false
}

Header.propTypes = {
  handleClick: PorpTypes.func,
  title: PorpTypes.string,
  isMarquee: PorpTypes.bool
}

export default Header
