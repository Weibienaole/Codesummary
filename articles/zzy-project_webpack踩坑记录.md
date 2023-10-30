## JS 热重载

index.js 中设置如下代码：

```js
if (module.hot) {
  module.hot.accept();
}
```

webpack.config.js 中设置如下代码：

```js
// devServer
hot: "true";
```

## 多次间隔很短的代码保存，上一次保存时浏览器更新时进行下一次保存，会报错

错误排查：

![Pasted Graphic.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0f7f2ad9955474ca2cc3bf8697a7f01~tplv-k3u1fbpfcp-watermark.image?)
浏览器显示 404，未找到文件地址\
webpack 中 log：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6916ff93219745f0b9a84db6c8aa79d1~tplv-k3u1fbpfcp-watermark.image?)

发现两次快速的保存之后，浏览器使用的依旧是上一次打包的 chunk(通过 hash 判断)

问题原因：设置了 cache

解决：设置为 `cache:false`

v2 但是设置为 false 每一次更新都很费时间，最后使用

```js
  cache: {
    type: 'filesystem',
    memoryCacheUnaffected: true,
  },
  experiments:{
    cacheUnaffected: true,
  },
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d64e08a80e14710b56465db625ea7a6~tplv-k3u1fbpfcp-watermark.image?)

配合热重载，基本上就不会再出现了

[cache 文档](https://webpack.docschina.org/configuration/cache/#root)

v3 惨痛教训，没好好看文档... type 设置 system 为将缓存存储到本地，而不是内存中，导致磁盘空间大减。
最后设置为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aaf20e329d9b4f57aaebfc4d1b4240ef~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/421339b806b04b2bb486febafdfa70cb~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc455e552c144564885739eee9952c41~tplv-k3u1fbpfcp-watermark.image?)

## 多次通过代码保存 reload 页面之后，爆栈，内存溢出

正在排查...
