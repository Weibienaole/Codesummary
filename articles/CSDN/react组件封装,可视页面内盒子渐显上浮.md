# 需求

- **滑动到可视窗口时，自下向上进行渐显**
- **不影响内部盒子的布局结构**
- **高度自定义(延迟时间，下沉距离)**

效果图(gif 较慢，实际上要快一些)：
![在这里插入图片描述](https://img-blog.csdnimg.cn/5ad664eeb7654f458c9294649c06cc43.gif#pic_center)

# 实现

## 思考

_像这种的需求，由于很多参数都是需要变量填充的，而且得保证内部盒子不会受影响，所以首先排除绝对定位来实现，而是使用 transform:translate(l/r,t/b) 来进行一个位置的变换。然后再配合 opacity 完成渐显。设置过渡(transition)来决定延迟时长_

## 步骤

- 首先它得是一个组件
- 获取到当前页面所有的目标 dom
- **判断当前视图中有无目标 dom，做相应的处理**
- 使用

### 首先它得是一个组件

#### jsx 部分

```javascript
// FloatDiv.jsx
import { useState, useEffect } from "react";

import "./index.css";
// HOOK写法
function FloatDiv({ children }) {
  const [a, as] = useState([]);
  useEffect(() => {}, []);

  return (
    <div className="FloatDiv_component">
      <div className="FloatDiv_component_aniBox">
        {/* 页面输入数据 */}
        {children}
      </div>
    </div>
  );
}

export default FloatDiv;
```

#### less 部分(这里用了 vscode 插件，自动转化.css 文件。所以.jsx 中引入的是.css)

_默认下沉 50px 完全透明。_

- **FloatDiv_component_aniClass** 类为滑动到可视画面之后需要追加的类\*
  _这里不加**transition**是因为延迟时间是活的，需要在**style**中显示。相对的，下沉距离也要这么做，也就是到时候要顶掉 css 文件中的 **transform:translate(l/r,t/b)** 所以需要在追加类名中的**transform**设置一个 **!important** 来保证这个样式的层级足够生效_

```css
.FloatDiv_component {
  width: auto;
  height: auto;
  position: relative;
  .FloatDiv_component_aniBox {
    opacity: 0;
    transform: translate(0, 50px);
  }
  .FloatDiv_component_aniClass {
    opacity: 1;
    transform: translate(0, 0) !important;
  }
}
```

### 获取到当前页面所有的目标 dom

```javascript
// FloatDiv.jsx
import { useState, useEffect } from "react";

import "./index.css";

const floatDomClassName = ".FloatDiv_component .FloatDiv_component_aniBox";
let doms = [];

// HOOK写法
function FloatDiv({ children }) {
  const [a, as] = useState([]);
  useEffect(() => {
    // 将伪数组转化为真正的数组，使其可以用数组的方法
    const d = Array.prototype.slice.call(
      document.querySelectorAll(floatDomClassName)
    );
    doms = d;
    // 之后需要执行的方法
    init();
  }, []);
  // ...some code
}

export default FloatDiv;
```

### 判断当前视图中有无目标 dom，做相应的处理

可视区域获取目标 DOM 有两种方式，一种是经典的滚动条监听，一种是[IntersectionObserver](https://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)
在这里可以首先判断 IntersectionObserver API 是否可用，不可用之后使用滚动条监听的方式去实现这个逻辑

组件还需要开放一些自定义参数，**延迟时间(delay)**、**下沉距离(down)**

```javascript
// ...some code
import PropTypes from "prop-types";

/**
 * @param {Number} delay 动画延迟触发时间  默认 0s
 * @param {Number} down 盒子下浮距离  默认 50px
 */

const floatDomClassName = ".FloatDiv_component .FloatDiv_component_aniBox";
// 节流函数
let _throttleFn;
let doms = [];

// 这里设置参数的默认值
function FloatDiv({ children, delay = 0, down = 50 }) {
  // eslint-disable-next-line no-unused-vars
  const [a, as] = useState([]);
  useEffect(() => {
    // 获取所有需要设置的dom，并将伪数组转化为数组
    const d = Array.prototype.slice.call(
      document.querySelectorAll(floatDomClassName)
    );
    doms = d;
    init();
  }, []);

  const init = () => {
    // 此API可用时
    if ("IntersectionObserver" in window) {
      let floatDomObserver = new IntersectionObserver((entries) => {
        // 循环遍历每一个目标
        entries.forEach((entry, index) => {
          // 如果元素可见
          if (entry.isIntersecting) {
            // 获取目标DOM
            let floatDom = entry.target;
            // 短暂延迟之后更新类名
            const timer = setTimeout(() => {
              floatDom.className = "box1 FloatDiv_component_aniClass";
              clearTimeout(timer);
            }, 300);
            // 更新之后移除此DOM，不再监听
            floatDomObserver.unobserve(floatDom);
            // 更新外部dom组
            doms.splice(index, 1);
          }
        });
      });
      // 便利doms 依次监听每一个dom
      doms.forEach((floatDomItem) => {
        floatDomObserver.observe(floatDomItem);
      });
    } else {
      // 默认调用第一次
      inViewShow();
      // 设置节流
      _throttleFn = throttle(inViewShow);
      // 开启监听
      document.addEventListener("scroll", _throttleFn.bind(this));
    }
  };

  const inViewShow = () => {
    let len = doms.length;
    // 遍历每一个dom
    for (let i = 0; i < len; i++) {
      let targetFloatElement = doms[i];
      // 获得当前DOM视口信息
      const { top, bottom } = targetFloatElement.getBoundingClientRect();
      // 出现在视野的时候加载图片
      // 因为设置下沉之后top是有按照下沉的高度去计算的，所以如果想要精确一些就需要扣除下沉距离(down)
      // 然后为了保证执行动画先比滑动快一些，再加10px作为保障(也可以删除，可选的)
      // 并且，在自下而上滚动时，保障盒子被滑动到了，才会进行展示，这里因为下沉是自下而上浮现的，所以不会额外加下沉的值
      if (
        top - down + 10 < document.documentElement.clientHeight &&
        bottom > 0
      ) {
        const timer = setTimeout(() => {
          targetFloatElement.className = "box1 FloatDiv_component_aniClass";
          clearTimeout(timer);
        }, 300);
        // 移除掉已经显示的
        doms.splice(i, 1);
        len--;
        i--;
        if (doms.length === 0) {
          // 如果全部都加载完 则去掉滚动事件监听
          document.removeEventListener("scroll", _throttleFn);
        }
      }
    }
  };
  // 节流函数
  const throttle = (fn, delay = 100, mustRun = 30) => {
    let t_start = null;
    let timer = null;
    let context = this;
    return function () {
      let t_current = +new Date();
      let args = Array.prototype.slice.call(arguments);
      clearTimeout(timer);
      if (!t_start) {
        t_start = t_current;
      }
      if (t_current - t_start > mustRun) {
        fn.apply(context, args);
        t_start = t_current;
      } else {
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, delay);
      }
    };
  };
  return (
    <div className="FloatDiv_component">
      <div
        className="FloatDiv_component_aniBox"
        style={{
          transition: `all 1s ease ${delay}s`,
          transform: `translate(0, ${down}px)`,
        }}
      >
        {/* 页面输入数据 */}
        {children}
      </div>
    </div>
  );
}
// eslint 参数类型校验
FloatDiv.propTypes = {
  children: PropTypes.element,
  delay: PropTypes.number,
  down: PropTypes.number,
};
```

### 使用

到这里组件的开发就已经结束了，然后页面引入组件：

```javascript
import FloatDiv from "@/components/FloatDiv";
function Page() {
  return (
    <div id="homePage_wrap">
      <FloatDiv>
        <div className="txt">这是一个盒子aaa</div>
      </FloatDiv>
      <FloatDiv delay={1} down={20}>
        <div className="txt">这是一个盒子b</div>
      </FloatDiv>
      <FloatDiv delay={2} down={30}>
        <div className="txt">这是一个盒子c</div>
      </FloatDiv>
    </div>
  );
}
```

就有顶部的那个动画效果啦～
·
·
·
·
·
·
·
·
组件全貌：

```javascript
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./index.css";

/**
 * @param {Number} delay 动画延迟触发时间  默认 0s
 * @param {Number} down 盒子下浮距离  默认 50px
 */

const floatDomClassName = ".FloatDiv_component .FloatDiv_component_aniBox";
let _throttleFn;
let doms = [];
// HOOK写法
function FloatDiv({ children, delay = 0, down = 50 }) {
  // eslint-disable-next-line no-unused-vars
  const [a, as] = useState([]);
  useEffect(() => {
    // 获取所有需要设置的dom，并将伪数组转化为数组
    const d = Array.prototype.slice.call(
      document.querySelectorAll(floatDomClassName)
    );
    doms = d;
    init();
  }, []);

  const init = () => {
    if ("IntersectionObserver" in window) {
      let floatDomObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          // 如果元素可见
          if (entry.isIntersecting) {
            let floatDom = entry.target;
            const timer = setTimeout(() => {
              floatDom.className = "box1 FloatDiv_component_aniClass";
              clearTimeout(timer);
            }, 300);
            floatDomObserver.unobserve(floatDom);
            doms.splice(index, 1);
          }
        });
      });
      doms.forEach((floatDomItem) => {
        floatDomObserver.observe(floatDomItem);
      });
    } else {
      inViewShow();
      _throttleFn = throttle(inViewShow);
      document.addEventListener("scroll", _throttleFn.bind(this));
    }
  };

  const inViewShow = () => {
    let len = doms.length;
    for (let i = 0; i < len; i++) {
      let targetFloatElement = doms[i];
      const { top, bottom } = targetFloatElement.getBoundingClientRect();
      // 出现在视野的时候加载图片
      if (
        top - down + 10 < document.documentElement.clientHeight &&
        bottom >= 0
      ) {
        const timer = setTimeout(() => {
          targetFloatElement.className = "box1 FloatDiv_component_aniClass";
          clearTimeout(timer);
        }, 300);
        // 移除掉已经显示的
        doms.splice(i, 1);
        len--;
        i--;
        if (doms.length === 0) {
          // 如果全部都加载完 则去掉滚动事件监听
          document.removeEventListener("scroll", _throttleFn);
        }
      }
    }
  };
  const throttle = (fn, delay = 100, mustRun = 30) => {
    let t_start = null;
    let timer = null;
    let context = this;
    return function () {
      let t_current = +new Date();
      let args = Array.prototype.slice.call(arguments);
      clearTimeout(timer);
      if (!t_start) {
        t_start = t_current;
      }
      if (t_current - t_start > mustRun) {
        fn.apply(context, args);
        t_start = t_current;
      } else {
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, delay);
      }
    };
  };

  return (
    <div className="FloatDiv_component">
      <div
        className="FloatDiv_component_aniBox"
        style={{
          transition: `all 1s ease ${delay}s`,
          transform: `translate(0, ${down}px)`,
        }}
      >
        {/* 页面输入数据 */}
        {children}
      </div>
    </div>
  );
}

FloatDiv.propTypes = {
  children: PropTypes.element,
  delay: PropTypes.number,
  down: PropTypes.number,
};

export default FloatDiv;
```

# 若转载，请表明原文地址、作者！
