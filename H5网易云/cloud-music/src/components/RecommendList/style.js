import styled from 'styled-components'
import style from '../../assets/global-style'

export const ListWrapper = styled.div`
  max-width: 100%;
  .title {
    font-weight: 700;
    font-size: 14px;
    padding-left: 6px;
    line-height: 60px;
  }
`

export const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`

export const ListItem = styled.div`
  width: 32%;
  position: relative;
  .img_wrapper {
    position: relative;
    padding-bottom: 100%;
    height: 0;
    .decorate {
      position: absolute;
      top: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(hsla(0,0%,43%,.4),hsla(0,0%,100%,0));
      z-index: 1;
    }
    .play_count {
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: ${style['font-size-s']};
      line-height: 15px;
      color: ${style['font-color-light']};
      .play {
        vertical-align: top;
      }
    }
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
  }
  .desc {
    overflow: hidden;
    padding: 0 2px;
    height: 35px;
    margin: 2px 0 15px;
    text-align: left;
    font-size: ${style["font-size-s"]};
    line-height: 1.4;
    color: ${style["font-color-desc"]};
    ${style.noWraps(2)};
  }
`