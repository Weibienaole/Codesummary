class DevTools {
  // 算法类
  // 根据数组生成树结构
  /*
  const comments1 = [
    { id: 1, parentId: null },
    { id: 2, parentId: 1 },
    { id: 3, parentId: 1 },
    { id: 4, parentId: 2 },
    { id: 5, parentId: 4 }
  ];
  */
  generateTree(items, parentId = null, selectVal = 'parentId') {
    return items.filter(item => item[selectVal] === parentId).map(i => { return { ...i, children: this.generateTree(items, i.id, selectVal) } })
  }

  // 全等判断 ---> 在两个变量之间进行深度比较以确定它们是否全等。
  // allEquals({ a: [2, { e: 3 }], b: [4], c: 'foo' }, { a: [2, { e: 3 }], b: [4], c: 'foo' }); // true
  allEquals(a, b) {
    if (a === b) return true;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
    if (a.prototype !== b.prototype) return false;
    let keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    return keys.every(function (k) { return allEquals(a[k], b[k]) });
  };


  // time

  // 返回当前24小时制时间的字符串
  // getColonTimeFromDate3(new Date());
  getColonTimeFromDate(date) {
    return date.toTimeString().slice(0, 8);
  }

  // 返回日期间的天数
  // getDaysDiffBetweenDates4(new Date('2019-01-01'), new Date('2019-10-14'));
  getDaysDiffBetweenDates(dateInitial, dateFinal) {
    return (dateFinal - dateInitial) / (1000 * 3600 * 24);
  }

  // 时间格式转化年 -- 接受 ms 级的时间戳
  changeTimeYear(time) {
    time = parseInt(time) //将传入的时间戳的值转化为Number
    time = new Date(time);
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const date = time.getDate()
    return (
      year +
      '-' +
      (month >= 10 ? month : '0' + month) +
      '-' +
      (date >= 10 ? date : '0' + date) +
      ' '
    )
  }

  // 格式化 天:时:分:秒 参数 - 剩余时间戳 - 单位为 S
  formateSeconds(surPlusTime) {
    let secondTime = parseInt(surPlusTime) //将传入的秒的值转化为Number
    let min = 0 // 初始化分
    let h = 0 // 初始化小时
    let d = 0 // 初始化天
    let result = ''
    if (secondTime > 60) {
      //如果秒数大于60，将秒数转换成整数
      min = parseInt(secondTime / 60) //获取分钟，除以60取整数，得到整数分钟
      secondTime = parseInt(secondTime % 60) //获取秒数，秒数取佘，得到整数秒数
      if (min > 60) {
        //如果分钟大于60，将分钟转换成小时
        h = parseInt(min / 60) //获取小时，获取分钟除以60，得到整数小时
        min = parseInt(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
        if (h > 23) {
          d = parseInt(h / 24) // 获取天，获取分钟除以24，得到整数天
          h = parseInt(h % 24) // 获取天后取佘的小时，获取时除24取佘的时
        }
      }
    }
    result = `${d.toString().padStart(2, '0')}:${h
      .toString()
      .padStart(2, '0')}:${min
        .toString()
        .padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
    return result
    // return 00:00:00:00
  }
  // 时间戳转化为当前时间 
  formatNowTime(time) {
    function add0(m) { return m < 10 ? '0' + m : m }
    time = parseInt(time) //将传入的时间戳的值转化为Number
    time = new Date(time);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
  }


  // browser

  // 检查页面底部是否可见
  bottomVisible() {
    return (document.documentElement.clientHeight + window.scrollY >=
      (document.documentElement.scrollHeight || document.documentElement.clientHeight))
  }

  // 检查当前标签页是否活动
  isBrowserTabFocused() {
    return !document.hidden;
  }

  // 平滑滚动至顶部 --> 该代码段可用于平滑滚动到当前页面的顶部。
  scrollToTop() {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 8);
    }
  };

  // 滚动到指定元素区域 --> 该代码段可将指定元素平滑滚动到浏览器窗口的可见区域。
  // smoothScroll11('#fooBar');
  smoothScroll(el) {
    document.querySelector(el).scrollIntoView({
      behavior: 'smooth'
    });
  }

  // 取当前页面的滚动位置
  //  getScrollPosition(); // {x: 0, y: 200}
  // el 为选定 dom 默认 window
  // 返回 {x: , y: }
  getScrollPosition(el = window) {
    return {
      x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
      y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
    }
  }

  // 功能描述：一些业务场景，如弹框出现时，需要禁止页面滚动，这是兼容安卓和 iOS 禁止页面滚动的解决方案
  // 固定滚动条  接受一个y轴 Number
  preventScroll(scrollNum) {
    // 存储当前滚动位置
    scrollNum = window.scrollY;

    // 将可滚动区域固定定位，可滚动区域高度为 0 后就不能滚动了
    document.body.style["overflow-y"] = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = -scrollNum + "px";
    // document.body.style['overscroll-behavior'] = 'none'
  }
  // 恢复滚动条  接受一个y轴 Number  如果配合 preventScroll 方法使用需要现将 固定前的滚动条高度记录，再恢复时赋值给 recoverScroll 方法
  recoverScroll(scrollNum) {
    document.body.style["overflow-y"] = "auto";
    document.body.style.position = "static";
    // document.querySelector('body').style['overscroll-behavior'] = 'none'

    window.scrollTo(0, scrollNum);
  }

  // 检查指定的元素在视口中是否可见

  // elementIsVisibleInViewport(el); // 需要左右可见
  // elementIsVisibleInViewport(el, true); // 需要全屏(上下左右)可以见

  elementIsVisibleInViewport(el, partiallyVisible = false) {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
      ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
  }

  // 某个元素开启全屏 接受一个 dom 作为参数
  launchFullscreen(el) {
    if (el.requestFullscreen) {
      el.requestFullscreen()
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen()
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen()
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullScreen()
    }
  }

  // 关闭全屏模式
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }


  // js

  // 将一组表单元素转化为对象
  /*
    example
    formToObject(document.querySelector('#form')); 
        { email: 'test@email.com', name: 'Test Name' }
  */
  formToObject(form) {
    return Array.from(new FormData(form)).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value
      }),
      {}
    );
  }

  // 将字符串复制到剪贴板
  /*
    example: 
    copyToClipboard('Lorem ipsum'); 
      'Lorem ipsum' copied to clipboard
  */
  copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  }

  // 金钱格式化，三位加逗号
  formatMoney(val) {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  // B转换到KB,MB,GB并保留两位小数  参数接受一个 b 字节 为单位的值
  formatFileSize(fileSize) {
    let temp;
    if (fileSize < 1024) {
      return fileSize + 'B';
    } else if (fileSize < (1024 * 1024)) {
      temp = fileSize / 1024;
      temp = temp.toFixed(2);
      return temp + 'KB';
    } else if (fileSize < (1024 * 1024 * 1024)) {
      temp = fileSize / (1024 * 1024);
      temp = temp.toFixed(2);
      return temp + 'MB';
    } else {
      temp = fileSize / (1024 * 1024 * 1024);
      temp = temp.toFixed(2);
      return temp + 'GB';
    }
  }

  // 去除空格
  // str 待处理字符串
  // type 去除空格类型 1-所有空格  2-前后空格  3-前空格 4-后空格 默认为1
  strTrim(str, type = 1) {
    if (type && type !== 1 && type !== 2 && type !== 3 && type !== 4) return;
    switch (type) {
      case 1:
        return str.replace(/\s/g, "");
      case 2:
        return str.replace(/(^\s)|(\s*$)/g, "");
      case 3:
        return str.replace(/(^\s)/g, "");
      case 4:
        return str.replace(/(\s$)/g, "");
      default:
        return str;
    }
  }

  // 检测移动/PC设备
  detectDeviceType() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ? 'Mobile'
      : 'Desktop';
  }

  // 当前设备是否是 android
  isAndroidPlatform() {
    const u = navigator.userAgent
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    return isAndroid
  }

  // 获取地址栏参数
  getUrlData(url) {
    if (url.slice(url.length - 2, url.length) === '#/') url = url.slice(0, url.length - 2)
    let o = {}
    let params = url.split('?')[1]
    if (!params) return {}
    params.split('&').map(item => {
      let r = item.split('=')
      o[item.split('=')[0]] = r[1]
    })
    return o
  }

  // 上传文件
  uploadImage({ url, file }) {
    let fromData = new FormData();
    fromData.append('imgFile', file);
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: fromData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        resolve(res.data);
      }).catch(e => {
        reject(e)
      })
    })
  }

  // rem*16px(以蓝湖rem设置为标准 设置16px的rem就是 *8)
  setDomRem(num = 8) {
    (function (designWidth, maxWidth) {
      var doc = document,
        win = window;
      var docEl = doc.documentElement;
      var tid;
      var rootItem, rootStyle;

      function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        if (!maxWidth) {
          maxWidth = 540;
        }
        ;
        if (width > maxWidth) {
          width = maxWidth;
        }
        //与淘宝做法不同，直接采用简单的rem换算方法1rem=100px
        var rem = width * +num / designWidth;
        //兼容UC开始
        rootStyle = "html{font-size:" + rem + 'px !important}';
        rootItem = document.getElementById('rootsize') || document.createElement("style");
        if (!document.getElementById('rootsize')) {
          document.getElementsByTagName("head")[0].appendChild(rootItem);
          rootItem.id = 'rootsize';
        }
        if (rootItem.styleSheet) {
          rootItem.styleSheet.disabled || (rootItem.styleSheet.cssText = rootStyle)
        } else {
          try {
            rootItem.innerHTML = rootStyle
          } catch (f) {
            rootItem.innerText = rootStyle
          }
        }
        //兼容UC结束
        docEl.style.fontSize = rem + "px";
      };
      refreshRem();

      win.addEventListener("resize", function () {
        clearTimeout(tid); //防止执行两次
        tid = setTimeout(refreshRem, 300);
      }, false);

      win.addEventListener("pageshow", function (e) {
        if (e.persisted) { // 浏览器后退的时候重新计算
          clearTimeout(tid);
          tid = setTimeout(refreshRem, 300);
        }
      }, false);

      if (doc.readyState === "complete") {
        doc.body.style.fontSize = "16px";
      } else {
        doc.addEventListener("DOMContentLoaded", function (e) {
          doc.body.style.fontSize = "16px";
        }, false);
      }
    })(375, 750);
  }

  // 生产环境不显示 console.log
  rewirteLog() {
    console.log = function(){}
  }

  // 增强版typeOf typeOf 关键字对于null，date 都会认为是Object，不准确
  typeOf(data) {
    let res = Object.prototype.toString.call(data).split(' ')[1]
    return res.slice(0, res.length - 1)
  }

  // 深拷贝
  deepClone(target) {
    let result;
    if (typeof target === 'object') {
      if (Array.isArray(target)) {
        result = [];
        for (let i in target) {
          result.push(deepClone(target[i]))
        }
      } else if (target === null) {
        result = null;
      } else if (target.constructor === RegExp) {
        result = target;
      } else {
        result = {};
        for (let i in target) {
          result[i] = deepClone(target[i]);
        }
      }
    } else {
      result = target;
    }
    return result;
  }

  // 启用图片懒加载
  // 需要设置html中的img src为空，data-src属性为目标路径
  // 必须等待加载目标的 data-src 属性赋值完毕，再执行此方法
  lazyImage(className = null) {
    // 懒记载图片列表，将伪数组转为数组，以便可以使用数组的api      
    let imageElements = Array.prototype.slice.call(className ? document.querySelectorAll(className) : document.getElementsByTagName('img')), _throttleFn
    // 只针对具有参数的值进行处理
    imageElements = imageElements.filter(item => item.dataset.src)
    init()
    function inViewShow() {
      let len = imageElements.length
      for (let i = 0; i < len; i++) {
        let imageElement = imageElements[i]
        const rect = imageElement.getBoundingClientRect()
        // 出现在视野的时候加载图片        
        if (rect.top < document.documentElement.clientHeight) {
          imageElement.src = imageElement.dataset.src
          // 移除掉已经显示的          
          imageElements.splice(i, 1)
          len--
          i--
          if (imageElements.length === 0) {
            // 如果全部都加载完 则去掉滚动事件监听            
            document.removeEventListener('scroll', _throttleFn)
          }
        }
      }
    }
    // 节流
    function throttle(fn, delay = 100, mustRun = 30) {
      let t_start = null
      let timer = null
      let context = this
      return function () {
        let t_current = +(new Date())
        let args = Array.prototype.slice.call(arguments)
        clearTimeout(timer)
        if (!t_start) {
          t_start = t_current
        }
        if (t_current - t_start > mustRun) {
          fn.apply(context, args)
          t_start = t_current
        } else {
          timer = setTimeout(() => {
            fn.apply(context, args)
          }, delay)
        }
      }
    }
    function init() {
      // 通过IntersectionObserver api判断图片是否出现在可视区域内，不需要监听Scroll来判断      
      if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry, index) => {
            // 如果元素可见            
            if (entry.isIntersecting) {
              let lazyImage = entry.target
              lazyImage.src = lazyImage.dataset.src
              lazyImage.classList.remove("lazy-image")
              lazyImageObserver.unobserve(lazyImage)
              imageElements.splice(index, 1)
            }
          })
        })
        imageElements.forEach(function (lazyImage) {
          lazyImageObserver.observe(lazyImage);
        })
      } else {
        inViewShow()
        _throttleFn = throttle(inViewShow)
        document.addEventListener('scroll', _throttleFn.bind(this))
      }
    }
  }

  // 防抖 执行函数,间隔时间,是否立即执行一次
  debounce(func, wait, immediate = true) {
    var timeout, result;
    var debounced = function () {
      var context = this;
      var args = arguments;
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        // 如果已经执行过，不再执行
        var callNow = !timeout;
        timeout = setTimeout(function () {
          timeout = null;
        }, wait)
        if (callNow) result = func.apply(context, args)
      } else {
        timeout = setTimeout(function () {
          func.apply(context, args)
        }, wait);
      }
      return result;
    };
    debounced.cancel = function () {
      clearTimeout(timeout);
      timeout = null;
    };
    return debounced;
  }

  // 节流 执行函数,间隔时间,设置{leading: 调用后是否立即执行一次,trailing: 结束后是否还要执行一次} 默认都为true，但都不能为false
  throttle(func, wait, options) {
    var timeout, context, args
    // 上一次的时间点
    var previous = 0
    if (!options) options = {}

    var later = function () {
      previous = options.leading === false ? 0 : new Date().getTime()
      timeout = null
      func.apply(context, args)
      if (!timeout) context = args = null
    }

    var throttled = function () {
      // 拿到当前时间的时间戳
      var now = new Date().getTime()
      // 如果 上一次时间为0 且 不设置立即执行，将当前时间赋值给上次时间
      if (!previous && options.leading === false) previous = now
      // 当前空档时间 设定等待值 - (当前 - 上一次时间)
      var remaining = wait - (now - previous)
      context = this
      args = arguments
      // console.log(arguments, 'arguments');
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        previous = now
        func.apply(context, args)
        if (!timeout) context = args = null
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining)
      }
    }

    throttled.cancel = function () {
      clearTimeout(timeout)
      previous = 0
      timeout = null
    }
    return throttled
  }

  // 无限滚动
  /**
   * 
   * @param {目标节点} dom 
   * @param {Function} cb 
   * @param {可选：关闭监听(只有在监听滚动条时才会有效，否则无效，可忽略(针对低版本浏览器启用监听滚动条方式进行处理))} devtools.infinityScrollIng.closeMonitor()
   * 
   * 
   * example:
   * devtools.infinityScrollIng(document.querySelector('.bottomScrollBar'), ()=>{
   * // 回调第一行必须设置 infinityScrollIng 的bol 属性为 false，意味着已经进程已经开始，必须等待结束(失败或者成功)才可以重新为true，才可以进行下一次的回调触发
   * devtools.infinityScrollIng.open = false
   * //  ...some code
   * devtools.infinityScrollIng.open = true // done
   * })
   */
  infinityScrolling(dom, cb) {
    const that = this
    this.infinityScrolling.bol = true
    let throttleFn
    //  需要一个外界bol判断是否加载完毕 不完毕不再次触发
    if ('IntersectionObserver' in window) {
      let intersectionOb = new IntersectionObserver(entry => {
        if (!this.infinityScrolling.bol) return
        // 1 - 可视范围内 0 - 不在可视范围内
        if (entry[0].intersectionRatio) cb()
      })
      // 对 dom 启用监听
      intersectionOb.observe(dom)
    } else {
      // 启用节流 100ms
      throttleFn = this.throttle(monitorScroll, 100)
      // 开启监听
      document.addEventListener('scroll', throttleFn)
    }
    // 关闭监听 scroll监听时
    this.infinityScrolling.closeMonitor = function () {
      if ('IntersectionObserver' in window) return
      // 关闭节流
      throttleFn.cancel()
      // 取消监听
      document.removeEventListener('scroll', throttleFn)
    }
    // 监听滚动条要做的事情
    function monitorScroll() {
      if (!that.infinityScrolling.bol) return
      // 检查指定的元素在视口中是否可见
      if (that.elementIsVisibleInViewport(dom, true)) cb()
    }
  }


  // html

  // 从字符串中删除HTML / XML标签。
  // deleteHTMLTags('<p><em>lorem</em> <strong class="asasasas">ipsum</strong></p>'
  deleteHTMLTags(str) {
    return str.replace(/<[^>]*>/g, '')
  }


  // css

  // 返回指定元素的生效样式
  // getDomStyle(document.querySelector('p'), 'font-size')
  getDomStyle(el, ruleName) {
    return getComputedStyle(el)[ruleName];
  }


  // app&js
  // JSBriged 交互处理方式 ios/android 通用
  /*
    appMethod(name, data).then(res=>{
      // 回调返回数据
    })
  */
  appMethod(name, data = null) {
    /**
     * name: 事件名
     * data: 参数 - 仅有调app事件持有
     */
    return new Promise(function (reslove, reject) {
      if (!window.setupWebViewJavascriptBridge) return reject('请先将 JSBriged.js 引入！')
      window.setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler(name, data, function (result) {
          reslove(result)
        })
      })
    })
  }
}

module.exports = DevTools