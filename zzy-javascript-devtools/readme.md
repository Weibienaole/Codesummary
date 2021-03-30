# 渣渣宇的开发工具包

## 目前分为两类，正则(regModules) 和 一些常用的方法(devtools)

### regModules

- 身份证 isIdCard(idCard)
- 手机号 isPhone(phone)
- 姓名 isName(name: 汉字)
- 英文 isEnglish(val)
- 整数 isInteger(val)
- 密码 isPassword(val)  a-z A-Z 0-9  long 6 < val < 21
- 邮箱 isEmail(val)
- 地址 isUrl(val)
- 价格、金额 isMoney(val) 带小数的正数，小数点后最多两位

### devtools

##### 算法类
- 根据数组生成树结构 

generateTree(list, parentId, selectVal)

返回一个新的数组

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
- 全等判断 ---> 在两个变量之间进行深度比较以确定它们是否全等。

allEquals(a,b) 

返回 Boolean

##### 时间
- 返回24小时制时间的字符串

getColonTimeFromDate(time)

接受一个 new Date() 的值 

- 返回两个日期之间的差值(天)

getDaysDiffBetweenDates(start, end)

接受一个 new Date() 的值 

- 时间格式转化年

changeTimeYear(time)

接受 ms 级的时间戳

- 格式化 天:时:分:秒

formateSeconds(time)

接受一个 剩余时间(s)

- 时间戳转化为当前时间 

formatNowTime(time)

接受 ms 级的时间戳

##### browser

- 检查页面底部是否可见 bottomVisible()
- 检查当前标签页是否活动 isBrowserTabFocused()
- 平滑滚动至顶部 --> 该代码段可用于平滑滚动到当前页面的顶部。 scrollToTop()
- 滚动到指定元素区域 --> 该代码段可将指定元素平滑滚动到浏览器窗口的可见区域。 smoothScroll('id|class')

该参数接受一个dom的类名/id

- 检测移动/PC设备 detectDeviceType()

返回一个 String 'Mobile' -> 移动端  'Desktop' -> PC端

- 当前设备是否为 安卓端  isAndroidPlatform()

返回一个 Boolean true -> Android  false -> iOS

- 获取地址栏参数 getUrlData(url)

该参数接受一个正确的url地址

返回一个对象 {参数名: 对应的值, ...}

- 上传文件 uploadImage({url, file})

该参数接受一个对象，包含 请求地址，目标文件

以Promise的形式返回值

- rem.js setDomRem(num)

该参数接受一个数值为 html 标签的 font-size 赋值

直接调用即可。

##### html
- 从字符串中删除HTML / XML标签。 deleteHTMLTags(str)

接受一个 string 类型的值

返回一个 String 类型的值

##### css
- 返回指定元素的生效样式 getDomStyle(el, ruleName)

参数 el -> dom   ruleName -> 样式名称

example: getDomStyle(document.querySelector('p'), 'font-size')

##### app&js
- JSBriged 交互处理方式 ios/android 通用

前置条件：必须先在html/框架内引入JSBriged script/入口文件 引入
-


```javascript
appMethod(name, data).then(res=>{
    /**
     * name: 事件名
     * data: 参数 - 仅有调app事件持有
     */
    })
```

这个交互事件必须由app和前端一起去处理，单方面是无法成功的
可以参考我的这篇文章： https://blog.csdn.net/weixin_44205605/article/details/106985069

## 未来不定期更新其他内容-。=