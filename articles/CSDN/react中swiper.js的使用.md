# 基础

```javascript
yarn add swiper@6.8.4 -D

import { Swiper, SwiperSlide } from 'swiper/react'

// 引入 Swiper 样式
import 'swiper/swiper.min.css'

<Swiper
  initialSlide={1} // 初始化显示哪一个
  loop={true} // 是否循环
  // 滑动触发
  onSlideChange={() => console.log('slide change')}
  // onSwiper 该函数将返回所创建Swiper的一个实例。可以将此实例保存到state，然后对其调用所需的所有方法
  onSwiper={el => console.log(el, 'el')}
>
  <SwiperSlide>Slide 1</SwiperSlide>
  <SwiperSlide>Slide 2</SwiperSlide>
  <SwiperSlide>Slide 3</SwiperSlide>
  <SwiperSlide>Slide 4</SwiperSlide>
  ...
</Swiper>
```

_在 react 中，swiper 的方法和官方文档中，html 中的方法有所不同，react 中通常在前面加一个 on，并以驼峰的方式组成。_

Ps: 不排除我没有找到...

## 额外添加模块

**_默认情况下，Swiper React 使用 Swiper 的核心版本（没有任何附加组件）。如果要使用导航、分页和其他组件，必须先安装它们。_**

[官方文档参考地址](https://swiperjs.com/react#usage)
_在此举例部分，殊途同归。_

```javascript
// 引入 安装模块，导航模块
import SwiperCore, { Navigation } from 'swiper'

// 使用安装模块对引入的模块进行安装
SwiperCore.use([Navigation])

    <Swiper
      className="mySwiper"
      // 设置导航
      navigation={{
        nextEl: '.swiper-button-next',
      	prevEl: '.swiper-button-prev',
      }}
    >
        <SwiperSlide>
          <div className="items" key={index}>
            <img src={item} alt="" className="itemPic" />
            // 上滑导航图片
            <img
              src={require('./image/arrowTop.png').default}
              alt=""
              className="swiper-button-prev"
            />
            // 下滑导航图片
            <img
              src={require('./image/arrowBottom.png').default}
              alt=""
              className="swiper-button-next"
            />
          </div>
        </SwiperSlide>
    </Swiper>

```

_最终代码_
最终效果是一个竖屏滚动，触底返回顶部。

```javascript
{
  abArr.length > 0 && (
    <Swiper
      className="mySwiper"
      direction="vertical"
      slidesPerView={1}
      speed={500}
      // 设置导航
      navigation={{
        // 需求缘故只设置了下滑的dom类
        nextEl: ".arrow",
      }}
      onSwiper={(el) => setSwiperR(el)}
      onSlideChange={(el) => {
        // 滑动触发
      }}
      onTouchEnd={(el) => {
        // 滑动结束触发
        if (el.isEnd) {
          swiperR.slideTo(0);
        }
      }}
    >
      {abArr.map((item, index) => (
        <SwiperSlide>
          <div className="items" key={index}>
            <img src={item} alt="" className="itemPic" />
            // 下滑导航图片
            <img
              src={require("./image/arrow.png").default}
              alt=""
              className="arrow arrowAnimation"
              onClick={() => {
                if (index === abArr.length - 1) {
                  swiperR.slideTo(0);
                }
              }}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
```

### 8-27

今天遇到一个 bug，记录一下

需求是要滑动在最后一页时，再下滑滑动到下标为 0 的位置

以下是基础实现，思路为滑动结束函数判断是否为最后一个(isEnd，判断最后一张时 上下滑)

```javascript
onTouchEnd={(el) => {
  // 滑动结束触发
  if (el.isEnd) {
    swiperR.slideTo(0, 300, false)
  }
}}
```

但是测试过程中发现一个问题，下滑触发的 slideTo 执行后停留在了下标为 1 的图上(此时我定的还是 0 )

经多 N 次的尝试，最终定位到问题所在 **滑动幅度** 上

小滑 也就是手指滑动屏幕不超过 40%距离时，slideTo 执行会到 1
大滑 超过 40%及以上 正常执行

目前并没有找到任何可以正面去解决这个问题的答案
但是可以曲线救国(如下)
执行完毕之后再次执行，最终还是解决这个问题了，但这个解决方式并不理想，希望有大佬看到之后可以解解惑

```javascript
onTouchEnd={(el) => {
  // 滑动结束触发
  if (el.isEnd) {
    swiperR.slideTo(0, 300, false)
    let timer = setTimeout(() => {
      swiperR.slideTo(0, 30, false)
      clearTimeout(timer)
    }, 301)
  }
}}
```

## swiper 7 使用

组件使用不在用`SwiperCore.use()`形式，而是在 Swiper 内添加`modules={[Autoplay, Pagination]}` 这种格式
![在这里插入图片描述](https://img-blog.csdnimg.cn/e55e549c47f54d4c9026b5d3885cacce.png)
部分模块属于组件，需要引入对应的样式，比如`Pagination`
![在这里插入图片描述](https://img-blog.csdnimg.cn/f1698848c39749bfa7a35a65aefc5b45.png)
第一行是总体的，使用就要引入。
第二行是针对单个组件的，自行在 node_modules 中查找并引入。
