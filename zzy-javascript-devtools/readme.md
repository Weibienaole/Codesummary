# 渣渣宇的开发工具包

## 目前分为两类，正则(regModules) 和 一些常用的方法(devtools)

### regModules


- 身份证 **isIdCard(idCard)**

- 验证护照（包含香港、澳门） **isPassport(val)**
- 手机号 **isPhone(phone)**
- 验证手机号中国(严谨), 根据工信部2019年最新公布的手机号段 **isPhoneStrict(phone)**
- 验证座机电话(国内),如: 0341-86091234 **isLandlineTelephone(phone)**
- 姓名 **isName(name: 汉字)**
- 英文 **isEnglish(val)**
- 整数 **isInteger(val)**
- 密码 **isPassword(val)**  a-z A-Z 0-9  long 6 < val < 21
- 邮箱 **isEmail(val)**
- 地址 **isUrl(val)**
- 价格、金额 **isMoney(val)** 带小数的正数，小数点后最多两位
- 验证邮政编码(中国) **isPostcode(val)**
- 验证微信号，6至20位，以字母开头，字母，数字，减号，下划线 **isWeChatNum(val)**
- 验证16进制颜色 **isColor16(val)**
- 验证火车车次 **isTrainNum(val)**
- 验证手机机身码(IMEI) **isIMEI(val)**
- 验证必须带端口号的网址(或ip) **isHttpAndPort(val)**
- 验证统一社会信用代码 **isCreditCode(val)**
- 验证迅雷链接 **isThunderLink(val)**
- 验证window"文件夹"路径 **isWindowsFolderPath(val)**
- 验证window下"文件"路径 **isWindowsFilePath(val)**
- 验证版本号格式必须为X.Y.Z **isVersion(val)**
- 验证视频链接地址（视频格式可按需增删） **isVideoUrl(val)**
- 验证图片链接地址（图片格式可按需增删） **isImageUrl(val)**
- 验证银行卡号（10到30位, 覆盖对公/私账户, 参考微信支付） **isAccountNumber(val)**
- 验证车牌号(新能源+非新能源) **isLicensePlateNumber(val)**
- 判读是否为外链 **isExternal(path)**

### devtools

##### 算法类
###### generateTree(list, parentId, selectVal)
- 根据数组生成树结构 
- 返回一个新的数组

```javascript
generateTree(初始数组, 默认id = null, 以哪个元素为ID进行生成 = 'parentId')
// 初始数组
const comments1 = [
  { id: 1, parentId: null },
  { id: 2, parentId: 1 },
  { id: 3, parentId: 1 },
  { id: 4, parentId: 2 },
  { id: 5, parentId: 4 }
];
// 拿到
[{id: 1, parentId: null, children: [{...}]}]

```
###### allEquals(a,b) 
- 全等判断 ---> 在两个变量之间进行深度比较以确定它们是否全等。
- 返回 Boolean

##### 时间
###### getColonTimeFromDate(time)
- 返回24小时制时间的字符串
- 接受一个 new Date() 的值 

###### getDaysDiffBetweenDates(start, end)
- 返回两个日期之间的差值(天)
- 接受一个 new Date() 的值 

###### changeTimeYear(time)
- 时间格式转化年
- 接受 ms 级的时间戳

###### formateSeconds(time)
- 格式化 天:时:分:秒
- 接受一个 剩余时间(s)

###### formatNowTime(time)
- 时间戳转化为当前时间 
- 接受 ms 级的时间戳

##### browser

###### bottomVisible()
- 检查页面底部是否可见

###### isBrowserTabFocused()
- 检查当前标签页是否活动
###### scrollToTop()
- 平滑滚动至顶部 --> 该代码段可用于平滑滚动到当前页面的顶部。
###### smoothScroll('id|class')
- 滚动到指定元素区域 --> 该代码段可将指定元素平滑滚动到浏览器窗口的可见区域。
- 该参数接受一个dom的类名/id

###### getScrollPosition(el = window)
- 取当前页面(元素)的滚动位置
- 该参数接受一个dom元素，默认为window

###### preventScroll(scrollNum)
- 固定滚动条
- 功能描述：一些业务场景，如弹框出现时，需要禁止页面滚动，这是兼容安卓和 iOS 禁止页面滚动的解决方案
- 接受一个y轴 Number
###### recoverScroll(scrollNum)
- 恢复滚动条
- 接受一个y轴 Number  如果配合 preventScroll 方法使用需要现将 固定前的滚动条高度记录，再恢复时赋值给 recoverScroll 方法
###### elementIsVisibleInViewport(el, partiallyVisible = false)
- 检查指定的元素在视口中是否可见
- elementIsVisibleInViewport(el); // 需要左右可见
- elementIsVisibleInViewport(el, true); // 需要全屏(上下左右)可以见
###### launchFullscreen(el)
- 某个元素开启全屏
- 接受一个 dom 作为参数

###### exitFullscreen()
- 关闭全屏模式 

##### js
###### formToObject(form)
- 将一组表单元素转化为对象
- formToObject(document.querySelector('#form'));  --->  { email: 'test@email.com', name: 'Test Name' }
###### copyToClipboard(str)
- 将字符串复制到剪贴板
- 接受一个 string 作为参数
###### formatMoney(val)
- 金钱格式化，三位加逗号
- 接受一个 Number
###### formatFileSize(fileSize)
- B转换到KB,MB,GB并保留两位小数  参数接受一个 b 字节 为单位的值
- 接受一个 String 返回一个 String
###### strTrim(str, type = 1)
- 去除空格
- str: 待处理字符串
- type: 去除空格类型 1-所有空格  2-前后空格  3-前空格 4-后空格 默认为1
- 返回一个 String
###### detectDeviceType()
- 检测移动/PC设备
- 返回一个 String 'Mobile' -> 移动端  'Desktop' -> PC端
###### isAndroidPlatform()
- 当前设备是否是 android 
- 返回一个 Boolean true -> Android  false -> iOS
###### getUrlData(url)
- 获取地址栏参数
- 该参数接受一个正确的url地址
- 返回一个对象 {参数名: 对应的值, ...}
###### uploadImage({url, file})
- 上传文件
- 该参数接受一个对象，包含 请求地址，目标文件
- 以Promise的形式返回值
###### setDomRem(num)
- rem.js
- 该参数接受一个数值为 html 标签的 font-size 赋值
- 直接调用即可。
###### typeOf(data)
- 增强版typeOf
- 该参数接受一个需要解析的值
- 返回一个解析之后的值
###### deepClone(target)
- 深拷贝
- 接受一个需要拷贝的内容
- 返回一个拷贝之后的内容
###### lazyImage()
- 启用图片懒加载
- 需要设置html中的img src为空，data-src属性为目标路径
###### debounce(func, wait, immediate)
- 函数防抖
- 参数： 执行函数, 等待时间, 是否立即执行一次(默认true)
- 可选方法 
- let debounce = debounce(func, wait, immediate)
- debounce.cancel 关闭防抖
###### throttle(func, wait, options)
- 函数节流
- 参数： 执行函数, 间隔时间, {leading: 调用后是否立即执行一次,trailing: 结束后是否还要执行一次} 默认都为true，但都不能为false
- 可选方法 
- let throttle = throttle(func, wait, options)
- throttle.cancel 关闭节流

##### html
###### deleteHTMLTags(str)
- 从字符串中删除HTML / XML标签。
- 接受一个 string 类型的值
- 返回一个 String 类型的值

##### css
###### getDomStyle(el, ruleName)
- 返回指定元素的生效样式
- 参数 el -> dom   ruleName -> 样式名称
- example: getDomStyle(document.querySelector('p'), 'font-size')

##### app&js
######  JSBriged()
- 交互处理方式 ios/android 通用
- 前置条件：必须先在html/框架内引入JSBriged script/入口文件 引入

```javascript
appMethod(name, data).then(res=>{
    /**
     * name: 事件名
     * data: 参数 - 仅有调app事件持有
     */
    })
```
- 这个交互事件必须由app和前端一起去处理，单方面是无法成功的
可以参考我的这篇文章： https://blog.csdn.net/weixin_44205605/article/details/106985069