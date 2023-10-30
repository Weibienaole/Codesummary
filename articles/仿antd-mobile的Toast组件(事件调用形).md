---
highlight: monokai
theme: github
---

## 为什么

通常的组件都是以基本的组件进行创建、调用，在一次项目开发时，突然意识到自行创建的提示框组件的按钮事件无法携带参数进行下一步的处理，就好比如遍历多个组件，需要删除其中某一个，点击删除出现弹窗，二次确认删除，但是在二次确认时，参数丢失，无法得知删除哪一个。

## 实现

核心是使用 `forwardRef` 和 `useImperativeHandle` 可以在父页面内调用组件内的事件

```jsx
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import styled from "styled-components";
import { keyframes } from "styled-components";
import { preventScroll, recoverScroll } from "zzy-javascript-devtools";

let nowScrollY = 0;
let loadingTimer;

/**
 * type 1-confirm 2-loading
 * confirm({title,cancel:左侧按钮,confirm:右侧按钮,onSuccess:成功回调,onFiled:失败回调,onFinally:无论结果如何都会执行的回调})
 * loading({title,maxTime:最大时间,onEnd:结束后回调})
 * hide() 隐藏
 *
 */

const Toast = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [contentObj, setContentObj] = useState({
    type: -1,
  });
  const [btnMethods, setBtnMethods] = useState([]);
  // 控制滚动条
  useEffect(() => {
    if (show) {
      fixedScreen();
    } else {
      fixedScreen(false);
      toastDestory();
    }
  }, [show]);
  // 销毁时清空定时器
  useEffect(() => {
    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);
  const fixedScreen = (isFixed = true) => {
    if (isFixed) {
      nowScrollY = window.scrollY;
      preventScroll(window.scrollY);
    } else {
      recoverScroll(nowScrollY);
    }
  };

  const lefBtnHandle = () => {
    btnMethods[1] && btnMethods[1]();
    btnMethods[2] && btnMethods[2]();
    setShow(false);
  };

  const rigBtnHandle = () => {
    btnMethods[0] && btnMethods[0]();
    btnMethods[2] && btnMethods[2]();
    setShow(false);
  };

  const warnToast = ({
    title = "",
    cancel = "取消",
    confirm = "确定",
    onSuccess,
    onFiled,
    onFinally,
  }) => {
    setShow(true);
    setContentObj({
      type: 1,
      title,
      lefBtn: cancel,
      rigBtn: confirm,
    });
    setBtnMethods([onSuccess, onFiled, onFinally]);
  };

  const loadingToast = ({
    title = "加载中...",
    maxTime = 1000 * 30,
    onEnd,
  }) => {
    setShow(true);
    setContentObj({
      type: 2,
      title,
      maxTime,
    });
    loadingTimer = setTimeout(() => {
      onEnd && onEnd();
      setShow(false);
    }, maxTime);
  };

  const hide = () => {
    toastDestory();
  };

  useImperativeHandle(ref, () => ({
    warnToast,
    loadingToast,
    hide,
  }));

  const toastDestory = () => {
    clearTimeout(loadingTimer);
    setShow(false);
    setContentObj({
      type: -1,
    });
    setBtnMethods([]);
  };

  const renderToast = () => {
    if (contentObj.type === 1) {
      return (
        <div className="Toast_component-contentBox Toast_component-contentBox_confirm">
          <div className="Toast_component-contentTxt">{contentObj.title}</div>
          <div className="Toast_component-btns">
            {contentObj.lefBtn && (
              <div
                className="Toast_component-btn Toast_component-lef"
                onClick={lefBtnHandle}
              >
                {contentObj.lefBtn}
              </div>
            )}
            {contentObj.rigBtn && (
              <div
                className="Toast_component-btn Toast_component-rig"
                onClick={rigBtnHandle}
              >
                {contentObj.rigBtn}
              </div>
            )}
          </div>
        </div>
      );
    } else if (contentObj.type === 2) {
      return (
        <div className="Toast_component-contentBox Toast_component-contentBox_loading">
          <img
            src={require("@/static/image/toastLoading.svg")}
            alt=""
            className="loadingIcon"
          />
          <div className="Toast_component-contentTxt">{contentObj.title}</div>
        </div>
      );
    }
  };
  return (
    <>{show ? <ToastCom id="Toast_component">{renderToast()}</ToastCom> : ""}</>
  );
});

const loadingIconAni = keyframes`
    0% {
    transform: rotate(360deg);
  }
    to {
    transform: rotate(0deg);
  }
`;

const ToastCom = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  .Toast_component-contentBox {
    width: 37.5rem;
    height: 15rem;
    background: #ffffff;
    border-radius: 0.5rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .Toast_component-contentTxt {
      font-size: 1.63rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      margin-bottom: 5rem;
      white-space: nowrap;
    }
    .Toast_component-btns {
      width: 26.06rem;
      height: 3.5rem;
      position: absolute;
      left: 50%;
      bottom: 2.06rem;
      transform: translate(-50%, 0);
      display: flex;
      justify-content: space-between;
      .Toast_component-btn {
        height: 100%;
        width: 11.88rem;
        border-radius: 0.13rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.63rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
      .Toast_component-lef {
        border: 0.06rem solid #bbbbbb;
        background: #fff;
        color: #bbbbbb;
      }
      .Toast_component-rig {
        background: #ff0000;
        border: 0.06rem solid #ff0000;
        color: #fff;
      }
    }
  }
  .Toast_component-contentBox_loading {
    flex-direction: column;
    .loadingIcon {
      width: 6.25rem;
      height: 6.31rem;
      animation: ${loadingIconAni} 3s linear infinite;
    }
    .Toast_component-contentTxt {
      margin: 2.13rem 0 0;
      font-size: 1.88rem;
    }
  }
`;

export default memo(Toast);
```

## 使用

```jsx
import Toast from "@/components/Toast";
const Example = (props) => {
  const toastRef = useRef();
  const showToast = () => {
    toastRef.current.confirmToast({
      title: "确认删除吗？",
      cancel: "取消",
      confirm: "确认",
      onSuccess() {
        console.log("onSuccess");
      },
      onFiled() {
        console.log("onFiled");
      },
    });
  };
  return (
    <div>
      <Toast ref={toastRef} />
      <div onClick={showToast}>点我展示</div>
    </div>
  );
};
```

## 22-7/26:纯事件调用

这几天搞 react 的 pc 项目，发现 antd 并没有全屏的 loading，决定自己整一个，正好补充这个空白：

```js
/**
 *
 * @param {String} txt  显示文案
 * @param {Number} time  loading超时时间 s
 * @param {Function} cb  超时后调用的回调
 *
 */

const loadingIcon = require("@/static/image/loading.svg");

const selfLoading = (txt = "加载中...", time = 60 * 2, cb) => {
  const loadDom = document.createElement("div");
  loadDom.setAttribute("id", "Loading-Component_Container");
  const childDom = document.createElement("div");
  childDom.className = "content";
  const childHTML = `
    <img src='${loadingIcon}' class="icon" />
    <span>${txt}</span>
  `;
  childDom.innerHTML = childHTML;
  loadDom.appendChild(childDom);
  document.body.appendChild(loadDom);
  let timer = setTimeout(() => {
    selfHideLoading();
    cb && cb();
    clearTimeout(timer);
  }, time * 1000);
};

const selfHideLoading = () => {
  try {
    const targetDom = document.querySelector("#Loading-Component_Container");
    document.body.removeChild(targetDom);
  } catch {
    console.log("loading component err: no more loading toast!");
  }
};

export { selfLoading, selfHideLoading };
```

### 使用

```js
import {selfHideLoading, selfLoading} from '../../../components/Loading'

// 显示
selfLoading('初始化...', 60, () => {do something...})
// 隐藏
selfHideLoading()
```

也没什么好讲的，反正延伸的话一个是 icon 可以扩展，一方面就是多事件，警告，错误，成功等，但这些的话 antd 里面有 message 可以使用，所以就当是补全了
