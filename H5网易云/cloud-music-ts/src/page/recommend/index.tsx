import { useState, useEffect, ReactElement, memo } from 'react'
import { withRouter } from 'react-router-dom'

import {
  Container,
  ListWrapper,
  ListItem,
  List
} from './style';
import { getCount } from '../../api/utils';
import request from '../../api/request';
import Slider from '../../components/Slider';
import Scroll from '../../baseUI/Scroll';


//mock 数据
const bannerList = [1, 2, 3, 4].map(item => {
  return { imageUrl: "http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg" }
});
const recommendList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => {
  return {
    id: 1,
    picUrl: "https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg",
    playCount: 17171122,
    name: "朴树、许巍、李健、郑钧、老狼、赵雷"
  }
});

const Recommend = (props): ReactElement => {

  const [pageData, setPageData] = useState<object>({})
  useEffect(() => {
  }, [])

  return <Container id="recommend_wrap">
    <Scroll>
      <div>
        <Slider list={bannerList}></Slider>
        <RecommendList list={recommendList}></RecommendList>
      </div>
    </Scroll>
  </Container>
}

const RecommendList = (props: ReocmmendListProps.Root) => {
  const { list } = props
  return <div className="RecommendList">
    <ListWrapper>
      <h1 className='title'>推荐歌单</h1>
      <List>
        {list.map((item: ReocmmendListProps.Item, index) => (
          <ListItem key={item.id + index}>
            <div className="img_wrapper">
              <div className="decorate"></div>
              {/* 加此参数可以减小请求的图片资源大小 */}
              <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music" />
              <div className="play_count">
                <i className="iconfont play">&#xe885;</i>
                <span className="count">{getCount(item.playCount)}</span>
              </div>
            </div>
            <div className="desc">{item.name}</div>
          </ListItem>
        ))}
      </List>
    </ListWrapper>
  </div>
}

declare module ReocmmendListProps {
  export interface Root {
    list: Item[]
  }
  export interface Item {
    id: number,
    picUrl: string,
    playCount: number,
    name: string,
    [key: string]: any,
  }
}

export default withRouter(memo(Recommend))
