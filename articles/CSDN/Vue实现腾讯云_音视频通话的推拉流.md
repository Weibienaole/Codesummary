目标：单对单通信
**大部分异步使用 async await 进行同步，try catch 捕获错误处理**
先放一个流程图，解决 80%的问题
![在这里插入图片描述](https://img-blog.csdnimg.cn/dbae6b32d8ca44cba04e0ec861b72555.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oOz5b-F5piv5rij5rij5a6H5LqG,size_20,color_FFFFFF,t_70,g_se,x_16)

## 安装 TRTC Web SDK

安装

```
npm install trtc-js-sdk --save
```

需要的页面中引入，或者全局引入

```javascript
import TRTC from "trtc-js-sdk";
```

## 创建 client,stream

created 中创建,存入当前页面的全局即可，不需要放入 data 中
[TRTC.createClient](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/TRTC.html#createClient)
[TRTC.createStream](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/TRTC.html#createStream)

```javascript
rtcClient = TRTC.createClient({
  mode: "rtc",
  sdkAppId: sdkAppId,
  userId: userId,
  userSig: userSig,
  // autoSubscribe: false
});
localStream = TRTC.createStream({
  userId: userId,
  audio: true,
  video: true,
});
```

## join 之后开启监听

**_join 之后开启监听，拉流主要在 on 监听中的 stream-added 中监听获取，然后拿到流使用 remoteStream.play() 在指定 dom id 中添加 video 进行播放_**

**_在 stream-leave 中监听用户是否离开房间，做相应的处理。_**

[rtcClient.join](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/Client.html#join)
[remoteStream.play](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/Stream.html#play)
[rtcClient.on](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/Client.html#on)
[on 监听事件](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/module-ClientEvent.html)

```javascript
await rtcClient.join({ roomId: id })
// 开启监听
this.handleClientEvents()
// 音视频监听
handleClientEvents() {
  // 错误
  rtcClient.on('error', (error) => {
    const errorCode = error.getCode()
    if (errorCode === 0x4043) {
      console.log('PLAY_NOT_ALLOWED')
      // PLAY_NOT_ALLOWED,引导用户手势操作并调用 stream.resume 恢复音视频播放
      // stream.resume()
    }
  })
  // 远端流添加事件，当远端用户发布流后会收到该通知。
  rtcClient.on('stream-added', (event) => {
    console.log('stream-added', event)
    // 远端流添加，在此进行处理
    const remoteStream = event.stream
    remoteStream.play('dom id').catch((error) => {
      console.log(error, 'play error')
    })
  })
  // 远端流更新事件，当远端用户添加、移除或更换音视频轨道后会收到该通知。
  rtcClient.on('stream-update', (event) => {
    console.log('stream-update', event)

  })
  // 远端流移除事件，当远端用户取消发布流后会收到该通知。
  rtcClient.on('stream-removed', (event) => {
    // this.$message.error('患者端视频推送异常，播放失败！')
    console.log('stream-removed', event)
  })
  // 远端流订阅成功事件，调用 subscribe() 成功后会触发该事件。
  rtcClient.on('stream-subscribed', (event) => {
    console.log('stream-subscribed', event)
  })
  // 远端用户进房通知
  rtcClient.on('peer-join', (event) => {
    console.log('peer-join', event)
  })
  // 远端用户退房通知
  rtcClient.on('peer-leave', (event) => {
    console.log('peer-leave', event)
  })
}
```

## 推流

以上已经完成了拉流，紧接着进行推流的处理。
**_初始化流的时候进行设备的检查，如果要求必须打开摄像头和麦克风，在此进行驳回_**
[localStream.initialize](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/LocalStream.html#initialize)
[rtcClient.publish](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/Client.html#publish)

```javascript
// 初始化流
await localStream.initialize();
// 初始化完成之后进行 发布流
await rtcClient.publish(localStream);
// 播放流
await localStream.play("dom id");
```

## 销毁

**_销毁会话可以分为三种，全部卸载，卸载本地，卸载远程_**
**_流程反着来，一步步关闭_**
[localStream.stop](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/LocalStream.html#stop)
[rtcClient.unpublish](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/Client.html#unpublish)
[localStream.close](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/LocalStream.html#close)
[rtcClient.leave](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/Client.html#leave)
[rtcClient.off](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/Client.html#off)

```javascript
// 卸载会话 1-全部卸载 2-本地卸载 3-远程卸载
async uninstallRtcClient(type = 1) {
  const loading = this.$loading({
    lock: true,
    text: '销毁会话中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    if (type !== 3) {
      await localStream.stop('dom id')
      try {
        await rtcClient.unpublish(localStream)
      } catch (e) {}
      await localStream.close()
    }
    if (type !== 2) {
      await localStream.stop('dom id')
    }
    await rtcClient.leave()
  } catch (e) {
    console.log(e, 'uninstallRtcClient err')
  }
  rtcClient.off('*')
  loading.close()
}
```

# 转载请标明原文及作者，谢谢！
