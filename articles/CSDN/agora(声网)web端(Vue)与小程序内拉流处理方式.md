简单说一下 agora 在不同框架内端应用，以后可以直接套用。
由于我只做过拉流，所以只记录拉流的步骤。

# 以下都是以 互动直播 产品为前提下进行的开发。

## Web 端(agora.version:4.3.0)

### 概述

```javascript
/**
 *  agora声网解决方案
 * 1. 创建 AgoraClient 对象
 * 2. join进入相应频道
 * 3. on 监听 user-published 拿到远端用户对象 AgoraRTCRemoteUser
 * 4. subscribe订阅流 将3.内的参数(远端用户对象, type('video'/'audio'))赋值给subscribe，拿到最新的远端用户信息
 * 5. 根绝监听 user-published 返回的type来分别处理音/视频
 *   video -> AgoraRTCRemoteUser.videoTrack.play(videoId 或者是 video的dom) 元素为 div
 *   user -> AgoraRTCRemoteUser.audioTrack.play()
 */
```

### 1.npm 安装相应插件

```
npm install agora-rtc-sdk-ng --save
```

### 2. 开发文件内引入 agora 对象

```javascript
import AgoraRTC from "agora-rtc-sdk-ng";
```

### 3. 创建 AgoraClient 对象

```javascript
const AgoraClient = AgoraRTC.createClient({
  mode: "live", // 模式
  codec: "vp8", // 编码格式
  role: "audience", // 角色
});
```

![createClient描述](https://img-blog.csdnimg.cn/20210219171000592.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDIwNTYwNQ==,size_16,color_FFFFFF,t_70)
[config: ClientConfig 参数信息](https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/web_ng/interfaces/clientconfig.html)

### 4. join 加入对应直播间频道

```javascript
// 由于join是异步处理，所以我使用了async&await
async initAgora() {
	await AgoraClient.join('your appId', 'your channle', '鉴权token', 'uid')
}
```

![join描述1j](https://img-blog.csdnimg.cn/20210219171721653.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDIwNTYwNQ==,size_16,color_FFFFFF,t_70)
![join描述2](https://img-blog.csdnimg.cn/20210219171804586.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDIwNTYwNQ==,size_16,color_FFFFFF,t_70)
_这里会得到一个返回的 uid 或者是已经设定好的 uid(这个需要和后台沟通，看是谁返回，我这边在这里有一些问题，虽然后台返回 uid 了，但是我没有用，也没有用 join 的 uid，因为后面订阅的时候它是可以自己获取到的，就只是让他自己 join 成功了)_

### 5. on 监听 'user-published'

```javascript
async initAgora() {
	await AgoraClient.join('your appId', 'your channle', '鉴权token', 'uid')
	AgoraClient.on('user-published', async (user, type) => {

    })
}
```

!['user-published'的描述](https://img-blog.csdnimg.cn/20210219172425729.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDIwNTYwNQ==,size_16,color_FFFFFF,t_70)
![开启监听之后第二个参数的回调函数的参数描述](https://img-blog.csdnimg.cn/20210219172536533.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDIwNTYwNQ==,size_16,color_FFFFFF,t_70)
_第一个参数 - 远端用户信息
需要拿上这个信息去进行订阅，从而拿到最新的音/视频
第二个参数 - type
告诉你监听到的是 video(视频)还是 audio(音频)_

### 6. 开启订阅

_on 监听 user-published 拿到的远端用户信息去订阅流
这里需要使用异步开启订阅_

```javascript
let userData = await AgoraClient.subscribe(user, type);
if (type === "video") {
  // 这里的 id 可以是一个 div 盒子的 id 属性，也可以是一个 dom，但标签必须是 div
  userData.play(id);
} else if (type === "audio") {
  userData.play();
}
```

![subscribe 描述](https://img-blog.csdnimg.cn/20210219174326969.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDIwNTYwNQ==,size_16,color_FFFFFF,t_70)
**部分浏览器会因为安全因素，在用户没有发生交互的情况下禁止音频 autoplay，所以需要创建一个动态的交互按钮，来进行点击即可进行播放**

_官方原因说明：[处理浏览器的自动播放策略](https://docs.agora.io/cn/live-streaming/autoplay_policy_web_ng)_

我自己的处理方式是在 **creted()生命周期**内根据**AgoraRTC**的全局方法，**onAudioAutoplayFailed**方法来监听音频是否出现异常，然后再显示弹窗让用户点击，从而取消限制。

_[IRemoteTrack(订阅得到的远端用户信息参数，上文的 userData) 描述地址](https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/web_ng/interfaces/iremotetrack.html)_

大概到这个地步就可以进行最基本的播放了。
接下来是销毁步骤，需要由 6 至 1 的进行销毁。

**因为我自己是多个直播同时展示，所以需要这样来处理，暂时不知道好不好使，开发完毕之后再来修改。**

```javascript
 // 销毁agora1 集体销毁
    async destoryAgora1() {
      console.log('开始销毁')
      let load = this.$loading({
        lock: true,
        text: '销毁直播中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let res = await Promise.all(
        this.agoraData.userList.map((i) => this.destoryAgora2(i))
      )
      // 这是存放远端用户信息的数组
      this.agoraData.userList = []
      load.close()
      return Promise.resolve()
    },
    // 销毁agora2 - 逐个单个销毁
    async destoryAgora2(user) {
      await AgoraClient.unsubscribe(user)
      AgoraClient.off('user-published', AgoraClient.leave())
      return Promise.resolve('res')
    },
```

暂时就这些了，日后开发完成再来编辑。

## 小程序

![步骤图](https://img-blog.csdnimg.cn/20210219175937933.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDIwNTYwNQ==,size_16,color_FFFFFF,t_70)
流程大概就是这个样子
**下文中 app.globalData.agoraClient 为 agora 创建后得到的对象**

### 1.init

init 这个方法我是在 app.js 内写的

```javascript
  agoraInit() {
    let that = this
    return new Promise((resolve, reject) => {
      let agoraId = 'your appId'
      that.globalData.agoraClient.init(agoraId, () => {
        console.log('初始化成功')
        resolve()
        // 设置角色为观众
        that.globalData.agoraClient.setRole('audience', () => {
          console.log('设置角色成功')
        }, (err) => {
          console.log(err, '设置角色失败')
        })
      }, () => {
        console.log('初始化失败')
        reject()
      })
    })
```

### 2. join

```javascript
agoraJoin() {
    return new Promise((resolve, reject) => {
      app.globalData.agoraClient.join(null, 'your channle', '声网id', () => {
        resolve() // 进行第三步
      }, err => {
        reject(err)
      })
    })
  },
```

### 3. 在 join 成功后 on 监听 'stream-added'

```javascript
app.globalData.agoraClient.on("stream-added", (e) => {
  console.log(e, "agora on 监听回调");
  // 前往第四步
  return that.getLiveUrl(agoraUID);
});
```

### 4. 根据 uid 来进行 subscribe 订阅

```javascript
	app.globalData.agoraClient.subscribe(uid, url => {
      console.log('拿到声网拉流地址', url)
    }, e =>
      console.log('拉流失败', e);
    });
```

_这大概就是所有的步骤了，标签的话使用 live-player， mode 属性是 RTC
销毁的话还是逐步销毁，直至全部完成。_

### agora 常用方法

_设置日志等级_

```javascript
AgoraRTC.setLogLevel(1);
```

![setLogLevel方法描述](https://img-blog.csdnimg.cn/20210219180258265.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDIwNTYwNQ==,size_16,color_FFFFFF,t_70)

## 如果转载，请标明地址，谢谢。

```javascript

```
