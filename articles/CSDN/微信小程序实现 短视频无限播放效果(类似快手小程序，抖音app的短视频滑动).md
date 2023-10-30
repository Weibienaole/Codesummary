# 实现原理

    利用小程序内置组件 swiper+video 来制定逻辑的方向

### 实现方式

设定 swiepr-item 数量为 4，也就是在 swiper 里面同时展示 4 个 video，避免过多导致页面卡顿
例： (假设数据请求一次获取 6 组数据)
[now, new, new, new] // 数据首次加载，将数据放置 swiper 盒子中
[old, now, new, new] // 向下滑动第一次(手指向下滑动,也就是看下一个视频)
[new, old, now, new] // 向下滑动第二次，也就是在 swiper 滑动到第三个的时候，启用轮循
[new, new, old, now] // 启用轮循之后，每次下滑都会将 swiepr 内的当前的 swiper-item 的未来第二个 swiper-item 替换

    	以此类推...

swiper 组件是 首尾衔接的循环状态

当前观看视频下标在内的上下 总计三条数据的 swiper-item 为可视区域(除去第一次请求)，数据的切换需要在可视区域外做处理，也就是 重复数据在 可视区域外的下一次滑动中出现时，需要做处理，也就是说，每一次的滑动，只需要处理掉可视区域之外的那条数据即可

    关于衔接滑动：
      主要作用
        阻止swiper在首次加载的时候向上滑，导致滑动到下标为3的swiepr-item上
        如果滑动过快，网络较差，有可能会导致videoBoxIndex > videoBox.length 具体下文会有所处理

# 实现它

### 参数设定

```javascript
data:{
  swiperVideoDataList: [], // swiper内循环的video
  videoBox: [], // 存放所有video的盒子
  videoBoxIndex: 0, // 总下标
  indexCurrent: 0, // 当前播放视频的下标
  circularBol: false, // swiper是否允许衔接滑动
  pageIndex: 0, // 当前页
  noNetWorkType: false, // 当前网络type  可以进行加载or网络错误  true or false
}

```

### 滑动规则

#### 下滑规则

          一轮 videoBoxIndex - 2  替换 - 0  实际 4 - ((videoBoxIndex % 4) + 2) -- 0
          二轮 vI - 3 替 - 1 实 -- -1
          三 vI - 4 替 - 2 实 -- 2
          四 vI - 5 替 - 3 实 -- 1
          五 vI - 6 替 - 0 实 -- 0  -- 新一轮
          六 vI - 7 替 - 1 实 -- -1
          七 vI - 8 替 - 2 实 -- 2
          八 vI - 9 替 - 3 实 -- 1
          九 vI - 10 替 - 0 实 -- 0 -- 新一轮
          十 vI - 11 替 - 1 实 -- -1
          十一 vI - 12 替 - 2 实 -- 2
          十二 vI - 13 替 - 3 实 -- 1
          十三 vI - 14 替 - 0 实 -- 0 -- 新一轮...

          so if 实 === 1  实 = 3
          abs(实)


#### 上滑规则

          11-1 12-2 13-3 14-0
          九 vI - 10 替 -  实 - 0   --- (videoBoxIndex - (videoBoxIndex>6? 4 : 0) - 2) % 4
          八 vI - 9 替 -  实 - 3
          七 vI - 8 替 -  实 - 2
          六 vI - 7 替 -  实 - 1
          五轮 videoBoxIndex - 6  替换 - 0  实际  0
          四 vI - 5 s替 - 0 实 -- 3
          三 vI - 4 替 - 3 实 -- 2
          二 vI - 3 替 - 0 实 -- -1

### 代码实现

```javascript
// 获取数据
getVideoDataList(){
  const that = this
  let obj = {
  	u: 'url',
  	method: 'POST',
  	data:{
  	  pageIndex: this.data.pageIndex
  	}
  }
  request(obj).then(res => {
    let dataArr = res.body.data
    let newVideoBox = [...that.data.videoBox, ...dataArr]
    that.setSwiperData(
          that.data.swiperVideoDataList,
          newVideoBox,
          that.data.videoBoxIndex
    )
    that.setData({
          pageIndex: that.data.pageIndex + 1,
    })
    // 首次加载的时候，加载完数据之后主动进行播放，其余都是在滑动之后进行播放
    if (that.data.pageIndex === 1) that.videoPlayerControl(that.data.indexCurrent)
  })
},
// 修改swiper内数据
/*
参数
swiperData: 最新的swiperVideoDataList
videoBox: 最新的videoData
videoBoxIndex: 最新的videoBoxIndex
sort: 正序--true  倒序--false     type:Boolean
*/
setSwiperData(swiperData, videoBox, videoBoxIndex, sort = true) {
  let that = this
  let datas = [...swiperData]

  if (that.data.pageIndex === 0) {
  // 首次加载的时候，只进行截取数据，不做其余处理
    datas = videoBox.slice(videoBoxIndex, 4)
  } else {
  	if(sort){
  	  //  计算要替换的下标
  	  let idx = swiperData.length - ((videoBoxIndex % 4) + 2)
  	  // 修正错误的下标(可能是逻辑错误，当前运用规律直接将错误修正)
  	  let saveIndex = Math.abs(idx === 1 ? 3 : idx)
  	  // 要替换的新数据
  	  let newDataList = videoBox[videoBoxIndex + 2]
  	  // 替换数据
  	  datas.splice(saveIndex, 1, newDataList)
  	  console.log('下滑修改swiper数据')
  	}else{
  	  //  计算要替换的下标
  	  let idx = (videoBoxIndex - (videoBoxIndex > 6 ? 4 : 0) - 2) % 4
  	  // 修正错误的下标(可能是逻辑错误，当前运用规律直接将错误修正)
  	  let saveIndex =
        videoBoxIndex > 1 ?
        Math.abs(idx) + 1 === 4 ?
        0 :
        Math.abs(idx) + 1 :
        Math.abs(idx)
  	  // 要替换的新数据
  	  let i = (videoBoxIndex === 1 ? 2 : videoBoxIndex + 1) - 2
  	  let newDataList = videoBox[i] || null
  	  // 替换数据
  	  if (videoBoxIndex > 0) datas.splice(videoBoxIndex === 1 ? 0 : saveIndex, 1, newDataList)
  	  console.log('上滑滑修改swiper数据')
  	}
  }
  this.setData({
    swiperVideoDataList: datas,
    videoBox,
    circularBol: videoBoxIndex > 1 &&
      videoBoxIndex + 4 <= videoBox.length &&
      !this.data.noNetWorkType,
    })
}
// 滑动触发 此方法参数 e 为swiper中携带 参考小程序 swiper API -- bindchange
swiperChange(e){
  let that = this
  // 正序 - true  倒序 - false
  let bol =
    (that.data.indexCurrent + 1 === 4 ? 0 : that.data.indexCurrent + 1) ===
    e.detail.current
  let newBoxIndex = bol ?
    that.data.videoBoxIndex + 1 :
    that.data.videoBoxIndex - 1
  // 判断当前网络状态 当断网的时候，不进行衔接滑动 -- 具体判断状态方式此文不阐述，具体参考 小程序 API -- wx.getNetworkType
  this.getNetworkTypeMes()
  // 判断条件1 -- 到达预定获取数据点且是下滑   条件2 -- 当前视频总下标 + 4 大于 总数据长度，网络较差||无网络
  if (
    (this.data.videoBoxIndex + 5 === this.data.videoBox.length && bol) ||
    this.data.videoBoxIndex + 4 >= this.data.videoBox.length
  ) {
    console.log('请求数据下滑处理', this.data.indexCurrent)
    videoTimer = setTimeout(()=> {
      that.getVideoDataList()
      clearTimeout(videoTimer)
    }, 600)
    // 条件一，向下滑动次数>=2， >=2时开始轮循   条件二，且向下滑动次数 >= 1 保证当boxIndex===1的时候将 indexCurrent === 0 的swiepr数据替换 (正常情况下都是替换 indexCurrent - 2 的数据 但是当boxIndex === 1 && indexCurrent === 1 的时候，只能替换首条)
  } else if (newBoxIndex >= 2 || (!bol && newBoxIndex >= 1)) {
    console.log('普通滑动处理')
    this.setSwiperData(
      this.data.swiperVideoDataList,
      this.data.videoBox,
      newBoxIndex,
      bol
    )
  }
  this.setData({
    swiperVideoDataList: newSwiperData,
    indexCurrent: e.detail.current,
    videoBoxIndex: newBoxIndex,
    },
    () => {
      // 每次下滑将所有的video暂停，防止滑动之后个别video声音异常
      for (let i = 0; i < 4; i++) {
        wx.createVideoContext(`myVideo${i}`).pause()
      }
      // 将当前video播放进度改为0s起始
      wx.createVideoContext(`myVideo${e.detail.current}`).seek(0)
    }
  )
}
// 滑动滑动结束时触发
animationEnd(e) {
  let data = [...this.data.swiperVideoDataList]
  if (data.length > 1) this.videoPlayerControl(e.detail.current)
},
videoPlayerControl(index){
  // 此为视频播放处理，该咋搞咋搞
}

```

大概就是这个样子了，主要的轮循逻辑都在代码里面展示了，躯干完成了，接下来的一些小功能也就手到擒来了

7-29

在此补充小程序代码片段链接～ [点此跳转](https://developers.weixin.qq.com/s/7mBjkcmB7AjA)

如果要轮循不断获取短视频进行播放的话，就会遇到几个有趣(头秃)的问题

1. 断网处理
2. IOS 13.5 版本 两指分别滑动会导致 swiper 卡屏(貌似是 swiper 组件的 bug,期待技术员修复)
3. swiper-item 首次滑动 下标为 1 滑动到 2 的过程中，如果手指滑动过快，会导致 动画丢失 且连带 **swiper 组件的 bindanimationfinish 事件不被触发** (这个似乎也是 swiper 的 bug...)
4. 上拉刷新以及上拉刷新之后 video 缓存问题
5. 等等等等(想不到了...)

这些问题都相当的有意思，大家如果有什么好的思路可以评论讨论一下～

###### 有什么问题的话欢迎评论区留言～

##### 如果转载请标明本文地址～
