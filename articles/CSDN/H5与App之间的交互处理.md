## H5 与 App 之间的一些简单交互(H5 主动调用 app 的方法)

第一种方法，H5 这边只需要调用 window 里面 app 注册好的方法，就可以

```javascript
function getAppMethods(anz, ios, data = null) {
  // 判断用户为 iOS 还是 Android  (device)
  let u = navigator.userAgent;
  let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
  if (isAndroid) {
    console.log("anz");
    window[anz](data);
  } else {
    console.log("ios");
    window.webkit.messageHandlers[ios](data);
  }
}
export default getAppMethods;
```

此是我简单封装的，可以直接进行使用，只是苦了 app 那边了 🤔
参看链接 : [安卓与 JS 的交互](https://www.cnblogs.com/fx88888/p/7999267.html)

这里和链接里面的调用方法不同，主要是因为如果只是简单的 HTML 页面的话，直接调用即可，但若是使用框架来进行调用的话，就行不通了

这列方法一版都是注册在 window 里面的

安卓方法定义:
example : window.messageHandles.getMsg(data)
安卓除了 window 都是 app 那边定义的，例 JAVA 的话，即使 public 名就是 messageHandles 其中的方法名即 getMsg data 为传递的参数

iOS 方法定义:
example: window.webkit.messageHandlers.getMsg(data)
如上所示，大概就是这个样子，只有之后的方法名是 app 那边定义的，其余是死的，data 为传递的参数

## H5 与 App 之间的深度交互(互相调用)

当然，随着业务的不断发展，肯定逃不了和 app 这边进行深度的交互，比如调用 app 之后，拿到 app 回调，进行一定的处理，这时第一种方法就不得行了，就得使用到 `JSBridge`

以下代码皆以 React 下完成

#### 1.项目入口文件或者根 js 文件(index.js)添加如下代码

```javascript
/**
 * 使用 JSBridge 总结：
 *  1、跟 IOS 交互的时候，只需要且必须注册 iosFuntion 方法即可，
 *      不能在 setupWebViewJavascriptBridge 中执行 bridge.init 方法，否则 IOS 无法调用到 H5 的注册函数；
 *  2、与安卓进行交互的时候
 *      ①、使用 iosFuntion，就可以实现 H5 调用 安卓的注册函数，但是安卓无法调用 H5 的注册函数，
 *          并且 H5 调用安卓成功后的回调函数也无法执行
 *      ②、使用 andoirFunction 并且要在 setupWebViewJavascriptBridge 中执行 bridge.init 方法，
 *          安卓才可以正常调用 H5 的回调函数，并且 H5 调用安卓成功后的回调函数也可以正常执行了
 */

const u = navigator.userAgent;
// Android终端
const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
// IOS 终端
const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

/**
 * Android  与安卓交互时：
 *      1、不调用这个函数安卓无法调用 H5 注册的事件函数；
 *      2、但是 H5 可以正常调用安卓注册的事件函数；
 *      3、还必须在 setupWebViewJavascriptBridge 中执行 bridge.init 方法，否则：
 *          ①、安卓依然无法调用 H5 注册的事件函数
 *          ①、H5 正常调用安卓事件函数后的回调函数无法正常执行
 *
 * @param {*} callback
 */
const andoirFunction = (callback) => {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      "WebViewJavascriptBridgeReady",
      function () {
        callback(window.WebViewJavascriptBridge);
      },
      false
    );
  }
};

/**
 * IOS 与 IOS 交互时，使用这个函数即可，别的操作都不需要执行
 * @param {*} callback
 */
const iosFuntion = (callback) => {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement("iframe");
  WVJBIframe.style.display = "none";
  WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
};

/**
 * 注册 setupWebViewJavascriptBridge 方法
 *  之所以不将上面两个方法融合成一个方法，是因为放在一起，那么就只有 iosFuntion 中相关的方法体生效
 */
window.setupWebViewJavascriptBridge = isAndroid ? andoirFunction : iosFuntion;
console.log(isAndroid, "isAndroid, 是否安卓");

/**
 * 这里如果不做判断是不是安卓，而是直接就执行下面的方法，就会导致
 *      1、IOS 无法调用 H5 这边注册的事件函数
 *      2、H5 可以正常调用 IOS 这边的事件函数，并且 H5 的回调函数可以正常执行
 */
if (isAndroid) {
  /**
   * 与安卓交互时，不调用这个函数会导致：
   *      1、H5 可以正常调用 安卓这边的事件函数，但是无法再调用到 H5 的回调函数
   *
   * 前提 setupWebViewJavascriptBridge 这个函数使用的是 andoirFunction 这个，否则还是会导致上面 1 的现象出现
   */
  console.log("index.js 安卓进入特定函数");
  window.setupWebViewJavascriptBridge(function (bridge) {
    // 注册 H5 界面的默认接收函数（与安卓交互时，不注册这个事件无法接收回调函数）
    console.log("index.js 注册H5页面的默认接受函数", bridge);
    bridge.init(function (msg, responseCallback) {
      responseCallback("JS 返回给原生的消息内容");
    });
  });
}
```

以上代码块没一定功底最好别改... 唉，看不懂看不懂 😔 还是待发掘

有了上面的初始化，接下来就简单了

##### 2.1 H5 调 app 的方法

场景: 点击选择相册图片(简单文件上传)

```javascript
// 点击切换、选择图片
  cutPic(index, bol = false) { // 此参数可省略 自己业务
    window.setupWebViewJavascriptBridge((bridge) => {
      bridge.callHandler(
        'uploadImages', // 此为调用app的方法名
        'H5 get app method cutPic', // 此为传入当然方法的参数
        (result) => {
          // result 为app回调返回的，类型可以先定义好
          // 在这里做数据返回处理
        }
      )
    })
  }
```

此为调用 App 方法 ，在回调内进行二次处理

##### 2.2 App 调 H5 方法

```javascript
window.setupWebViewJavascriptBridge((bridge) => {
  /**
   * data：原生传过来的数据
   * fn: 原生传过来的回调函数
   */
  bridge.registerHandler("getPicArrs", (data, fn) => {
    // getPicArrs -> 定义的方法名
    console.log(data, fn, "success");
    fn && fn();
  });
});
// class声明的话需要在constructor下注入(this.state)之下
```

更多关于 App 方面的处理，请参考原文

[使用 JSBridge 与原生 IOS、Android 进行交互（含 H5、Android、IOS 端代码，附 Demo）](https://blog.csdn.net/zgd826237710/article/details/95518433)
