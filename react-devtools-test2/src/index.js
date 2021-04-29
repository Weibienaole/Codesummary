import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import './index.css'
import App from './App'
import { devtools } from 'zzy-javascript-devtools'
// 兼容Android9以下机型
// import 'babel-polyfill'


/*
交互处理
import { devtools } from 'zzy-javascript-devtools'

devtools.appMethod(name, data).then(res=>{
  // 回调返回数据
})
*/

// 目前已具有事件
/**
 * pageShare - app分享能力 
 * JSON格式解码后
 * {
 *  shareTitle: 'shareTitle',
 *   shareContent: 'shareContent',
 *   shareUrl: 'shareUrl',
 *   shareImg: 'shareImg',
 *   shareChannels:  ["朋友圈","微信好友","QQ","微博","QQ空间"],
 * }
 * wxClientShare - 小程序分享 参数可以不传 如果传的话同上
 * closePage - 关闭H5页面
 * addVideo - 选择视频 参数配置：{type: Number} 1 -> 海选 其余待定
 * sharePoster - 分享海报  参数为一个对象，内部参数app定义
 */



// rem 设置
devtools.setDomRem(8)


if(process.env.REACT_APP_ENV === 'production') console.log = function(){}



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
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;

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
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(window.WebViewJavascriptBridge);
        }, false)
    }
}

/**
 * IOS 与 IOS 交互时，使用这个函数即可，别的操作都不需要执行
 * @param {*} callback 
 */
const iosFuntion = (callback) => {
    if (window.WebViewJavascriptBridge) { return callback(window.WebViewJavascriptBridge) }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback) }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function(){
         document.documentElement.removeChild(WVJBIframe);
    }, 0);
}

/**
 * 注册 setupWebViewJavascriptBridge 方法
 *  之所以不将上面两个方法融合成一个方法，是因为放在一起，那么就只有 iosFuntion 中相关的方法体生效
 */
window.setupWebViewJavascriptBridge = isAndroid ? andoirFunction : iosFuntion;
console.log(isAndroid, 'isAndroid, 是否安卓')

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
    console.log('index.js 安卓进入特定函数')
    window.setupWebViewJavascriptBridge(function (bridge) {
        // 注册 H5 界面的默认接收函数（与安卓交互时，不注册这个事件无法接收回调函数）
        console.log('index.js 注册H5页面的默认接受函数', bridge)
        bridge.init(function (msg, responseCallback) {
            responseCallback("JS 返回给原生的消息内容");
        })
    })
}

ReactDOM.render(<App />, document.getElementById('root'))
