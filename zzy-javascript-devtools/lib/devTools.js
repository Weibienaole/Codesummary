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
  smoothScroll(element) {
    document.querySelector(element).scrollIntoView({
      behavior: 'smooth'
    });
  }

  // 检测移动/PC设备
  detectDeviceType() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ? 'Mobile'
      : 'Desktop';
  }

  // 获取地址栏参数
  getUrlData(url) {
    if (url.slice(url.length - 2, url.length) === '#/') {
      url = url.slice(0, url.length - 2)
    }
    return url.split('?')[1].split('&').map(item => {
      let r = item.split('=')
      return { [item.split('=')[0]]: r[1] }
    })
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