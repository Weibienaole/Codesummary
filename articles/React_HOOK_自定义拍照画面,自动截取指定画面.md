# 需求

要求实现用户上传身份证照片，自定义上传画面，自动截取身份证图片，并获取身份证上面的信息。\
如果机型不支持则留有保底手段：相册上传图片，获取身份证上的信息。

# 大概思路

## 自定义上传画面

主要依赖 [navigator.mediaDevices.getUserMedia](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia) API

## 自动截取身份证图片

根据 `canvas.drawImage` 去生成画布，随后进行 `canvas.toDataURL` 获取 base64 格式的图片

## 获取身份证上面的信息

这个先将 base64 图片上传 oss，获取到图片 url，再根据百度 ocr 身份证识别，获取到对应正反面的信息。

# 效果

![WechatIMG261.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0810df62a02541d8aa336bd7b28620fc~tplv-k3u1fbpfcp-watermark.image?)

# 实现

此功能为组件形式注入到上传图片的页面中，为保存一些数据\
一些 utils 内的方法，redux 中的操作也都在下面展示。

## 核心代码

```jsx
import React, { memo, useEffect, useRef, useState } from "react";
import PropsType from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { detectDeviceType } from "zzy-javascript-devtools";
import { connect } from "react-redux";

import globalSty from "../../api/global-style";
import { getUserMedia, getXYRatio, cameraErrorMsg } from "../../api/utils";
import { getIdCardMsg, setCameraType } from "./store/actionCreators";
import HeaderBar from "../../components/HeaderBar";
import Toast from "../../components/Toast";
import { uploadFileBase64Req } from "../../api";

let captrueTimer;
let getStreamTimer;
let isStart = false;
let videoStreams;
let pageTimer;

const Camera = (props) => {
  const { type, close } = props;
  const {
    setCameraTypeDispatch,
    getIdCardMsgDispatch,
    changeIdCardMsg,
    uploadFile,
  } = props;
  // photo这个值是用来开发测试时在截取区域上方黑色地方展示当前截取base64图片的。
  // const [photo, setPhoto] = useState('')
  // 1-正面 2-反面
  const [idCardType, setIdCardType] = useState(1);
  useEffect(() => {
    // 页面进入时，正反面状态以父组件传值为准
    setIdCardType(type);
    // 开始计时,超过指定时间就关闭页面，保证不会长期在此页面调用接口
    startTimeing();
    return () => {
      clearTimeout(pageTimer);
    };
  }, []);
  const videoRef = useRef();
  // 截取区域 ref
  const rectangle = useRef();
  // 弹窗组件ref，下面的方法都为弹窗提示组件方法，可忽略。
  const toastRef = useRef();
  useEffect(() => {
    if (videoRef.current && !isStart) {
      isStart = true;
      // 获取视频流
      getUserMediaStream(videoRef.current).then(() => {
        getStreamTimer = setTimeout(() => {
          // 成功后延迟500ms开始进行图片截取
          startCaptrue();
          clearTimeout(getStreamTimer);
        }, 500);
      });
    }
    return () => {
      clearInterval(captrueTimer);
      // 页面销毁时进行整体销毁
      destoryStates();
    };
  }, [videoRef]);

  // 备用方案，相册icon，点击后销毁当前页
  const clickUploadFileHandle = () => {
    uploadFile();
    destoryStates();
    close();
  };

  // 必须在https下才可以使用，否则直接报错
  // 开始获取用户媒体流
  const getUserMediaStream = (videoNode) => {
    const params1 = {
      video: { facingMode: { exact: "environment" } }, // 设置true为获取前置，{ facingMode: { exact: 'environment' } } 为后置摄像头
    };
    const params2 = {
      video: {
        facingMode: "user",
      },
    };

    return getUserMedia({
      audio: false,
      // 判断为移动端还是pc端
      ...(detectDeviceType() === "Mobile" ? params1 : params2),
    })
      .then((res) => {
        videoStreams = res;
        return getStreamRes(res, videoNode);
      })
      .catch((error) => {
        console.log("访问用户媒体设备失败：", error.name, error.message, error);
        toastRef.current.warnToast({
          // cameraErrorMsg 为错误信息
          title: `${cameraErrorMsg(error.name)},请返回上级页面重新拍照上传`,
          cancel: "返回",
          confirm: "确认",
          onFinally() {
            // 失败后状态管理器内设置当前上传方式为图片上传，再次点击上传不进入此处，并销毁当前页面
            setCameraTypeDispatch("upload");
            destoryStates();
            close();
          },
        });
        return Promise.reject();
      });
  };
  // 调用成功
  const getStreamRes = (stream, video) => {
    return new Promise((resolve) => {
      video.srcObject = stream;
      // 在指定视频/音频（audio/video）的元数据加载后触发
      video.onloadedmetadata = () => {
        // 获取成功之后等待元数据加载后进行播放
        video.play();
        resolve();
      };
    });
  };
  // 截取裁剪框
  const startCaptrue = () => {
    const _canvas = document.createElement("canvas");
    _canvas.style.display = "block";

    // 根据video的xy比率，并提供外部比率进行换算
    const { YRatio, XRatio } = getXYRatio(videoRef.current);
    // 获取到截图面的数据
    const { left, top, width, height } =
      rectangle.current.getBoundingClientRect();
    _canvas.height = height;
    _canvas.width = width;

    const context = _canvas.getContext("2d");

    captrue();
    function captrue() {
      // 这里 drawImage 的参数有点问题，不是很严丝合缝，待后期调试，目前够用
      captrueTimer = setInterval(async () => {
        // 微信下沿偏多，但是其余浏览器中正好，保留参数
        // left,top 各扩展20px，width，height翻倍
        // top,height各累加20px 降低
        context.drawImage(
          videoRef.current,
          XRatio(left + window.scrollX - 20),
          YRatio(top + window.scrollY - 20) - 20,
          XRatio(width + 40),
          height + 40 + 20,
          0,
          0,
          width,
          height
        );
        // 获取当前截图的base64编码
        const base64 = _canvas.toDataURL("image/jpeg");
        console.log(base64, "base64");
        clearTimeout(captrueTimer);
        // 上传base64获取oss地址
        const { url } = await uploadFileBase64Req(base64, true);
        // 从ocr中获取身份证信息，getIdCardMsgDispatch 方法里面就已经包含了数据的校验
        const idCardsMsg = await getIdCardMsgDispatch(url, true);
        if (idCardsMsg.type === type) {
          // 校对成功，属于正确的一面
          close();
          changeIdCardMsg(idCardsMsg);
        } else {
          // 否则继续校验
          captrue();
        }
        // setPhoto(base64)
      }, 1500);
    }
  };

  const startTimeing = () => {
    pageTimer = setTimeout(() => {
      destoryStates();
      toastRef.current.warnToast({
        title: "页面停留过久,请返回上级页面重新拍照上传",
        cancel: "返回",
        confirm: "确认",
        onFinally() {
          close();
        },
      });
    }, 3 * 60 * 1000); // 三分钟
  };

  // 关闭流
  const closeCameras = () => {
    videoStreams && videoStreams.getTracks()[0].stop();
  };
  // 销毁页面数据
  const destoryStates = () => {
    closeCameras();
    isStart = false;
    clearTimeout(getStreamTimer);
    getStreamTimer = null;
    clearInterval(captrueTimer);
    captrueTimer = null;
    videoStreams = null;
  };

  return (
    <CameraContainer id="Camera_component_Container">
      <HeaderBar clickArrow={() => close()} />
      <video id="video" ref={videoRef} autoPlay muted playsInline></video>
      <div className="shadowView">
        <div className="rectangle" ref={rectangle}>
          {idCardType === 1 && (
            <img
              src={require("./image/renxiang.svg")}
              alt=""
              className="renxiang"
            />
          )}
          {idCardType === 2 && (
            <img
              src={require("./image/guohui.svg")}
              alt=""
              className="guohui"
            />
          )}
          <span className="say">请将身份证置于取景框内</span>
          <div className="handleBar">
            <img
              src={require("@/static/image/photo.svg")}
              alt=""
              className="photoIcon"
              onClick={clickUploadFileHandle}
            />
          </div>
        </div>
        {/* <img
          className="photo"
          src={photo}
          style={{ position: 'absolute', top: 0 }}
        ></img> */}
      </div>
      <Toast ref={toastRef} />
    </CameraContainer>
  );
};

Camera.propTypes = {
  type: PropsType.number,
  close: PropsType.func,
  changeIdCardMsg: PropsType.func,
  uploadFile: PropsType.func,
  setCameraTypeDispatch: PropsType.func,
  getIdCardMsgDispatch: PropsType.func,
};

const mapDispatchToProps = (dispatch) => ({
  setCameraTypeDispatch(type) {
    dispatch(setCameraType(type));
  },
  async getIdCardMsgDispatch(url, isCamera) {
    const data = await dispatch(getIdCardMsg(url, isCamera));
    return data;
  },
});
export default connect(null, mapDispatchToProps)(withRouter(memo(Camera)));

const CameraContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 11;
  overflow: hidden;
  background-color: #000;
  #video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .shadowView {
    /* ${globalSty.positionCenter()}; */
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    /* background-color: rgba(0, 0, 0, 0.4); */
    display: flex;
    align-items: center;
    justify-content: center;
    .rectangle {
      width: 80vw;
      /* 身份证件长宽比例 1.58:1 */
      height: calc(80vw / 1.58);
      border-radius: 1.5rem;
      border: 0.1rem solid rgba(243, 243, 243, 1);
      box-shadow: 0 0 0 2000rem rgba(0, 0, 0, 0.7);
      position: relative;
      .renxiang {
        position: absolute;
        right: 1rem;
        top: 45%;
        transform: translate(0, -50%);
        width: 15rem;
      }
      .guohui {
        position: absolute;
        top: 1.5rem;
        left: 2rem;
        width: 7.5rem;
      }
      .say {
        position: absolute;
        font-size: 1.5rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        left: 50%;
        bottom: -3.5rem;
        transform: translate(-50%, -50%);
      }
      .handleBar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -9rem;
        .photoIcon {
          width: 4rem;
          height: 4rem;
        }
      }
    }
  }
`;
```

## utils.js

```js
//访问用户媒体设备的兼容方法
const getUserMedia = (constrains) => {
  if (navigator.mediaDevices?.getUserMedia) {
    //最新标准API
    return navigator.mediaDevices.getUserMedia(constrains);
  } else if (navigator.webkitGetUserMedia) {
    //webkit内核浏览器
    return navigator.webkitGetUserMedia(constrains);
  } else if (navigator.mozGetUserMedia) {
    //Firefox浏览器
    return navigator.mozGetUserMedia(constrains);
  } else if (navigator.getUserMedia) {
    //旧版API
    return navigator.getUserMedia(constrains);
  }
};

const hasUserMedia = () => {
  if (navigator.mediaDevices?.getUserMedia) {
    //最新标准API
    return true;
  } else if (navigator.webkitGetUserMedia) {
    //webkit内核浏览器
    return true;
  } else if (navigator.mozGetUserMedia) {
    //Firefox浏览器
    return true;
  } else if (navigator.getUserMedia) {
    //旧版API
    return true;
  }
  return false;
};

const cameraErrorMsg = (name) => {
  if (name === "AbortError") {
    return "操作被终止";
  } else if (name === "NotAllowedError") {
    return "权限被拒绝";
  } else if (name === "NotFoundError") {
    return "无法满足操作";
  } else if (name === "NotReadableError") {
    return "读取失败";
  } else if (name === "OverconstrainedError") {
    return "设备无法被满足";
  } else if (name === "SecurityError") {
    return "权限被禁止";
  } else if (name === "TypeError") {
    return "传值错误";
  } else {
    return "操作失败";
  }
};

// 获取video的xy比率，并提供外部比率进行换算
function getXYRatio(video) {
  // videoHeight为video 真实高度
  // offsetHeight为video css高度
  const {
    videoHeight: vh,
    videoWidth: vw,
    offsetHeight: oh,
    offsetWidth: ow,
  } = video;

  return {
    YRatio: (height) => {
      return (vh / oh) * height;
    },
    XRatio: (width) => {
      return (vw / ow) * width;
    },
  };
}

// 判断身份证信息来自正/反
const isIdCardType = (msg) => {
  if (msg.name && msg.sex && msg.idcard) {
    return 1;
  } else if (msg.authority && msg.validDate) {
    return 2;
  } else return 0;
};
```

## store

store 中使用了 immutable 格式，不清楚的朋友可以先看一下文档，只是改变数据结构，其余的没什么变化。

### reducer.js

```js
import { fromJS } from "immutable";
import { CHANGE_IDCARD_MSG, SET_CAMERA_TYPE } from "./constants";

const defaultState = fromJS({
  cameraType: "camera", // upload-拍照上传 camera-实时传输
  idCardMsg: {},
});

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_CAMERA_TYPE:
      return state.set("cameraType", action.data);
    case CHANGE_IDCARD_MSG:
      return state.set("idCardMsg", action.data);
    default:
      return state;
  }
};

export default reducer;
```

### actionCreators.js

```js
import { Toast } from "antd-mobile";
import { fromJS } from "immutable";
import { isIdCard, isName } from "zzy-javascript-devtools";
import { idCardAndlysisReq } from "../../../api";
import { getAge, isIdCardType } from "../../../api/utils";
import { CHANGE_IDCARD_MSG, SET_CAMERA_TYPE } from "./constants";

export const setCameraType = (data) => ({
  type: SET_CAMERA_TYPE,
  data: fromJS(data),
});

const changeIdCardMsg = (data) => ({
  type: CHANGE_IDCARD_MSG,
  data: fromJS(data),
});

export const getIdCardMsg = (url, isCamera = false) => {
  return async (dispatch) => {
    const res = await idCardAndlysisReq(url, isCamera);
    const type = isIdCardType(res);
    const { name, idcard, sex, authority, validDate } = res;
    if (type === 1) {
      if (isName(name) && isIdCard(idcard)) {
        const age = getAge(idcard);
        const obj = { name, idcard, sex, age, type: 1, url };
        dispatch(changeIdCardMsg(obj));
        return obj;
      } else {
        return isCamera ? "" : Toast.offline("信息获取错误，请重新上传！", 3);
      }
    } else if (type === 2) {
      const obj = { authority, validDate, type: 2, url };
      dispatch(changeIdCardMsg(obj));
      return obj;
    } else {
      return isCamera ? "" : Toast.offline("信息获取错误，请重新上传！", 3);
    }
  };
};

export const clearIdCardMsg = () => {
  return (dispatch) => {
    dispatch(changeIdCardMsg({}));
  };
};
```

# 插件版本

```json
{
  "devDependencies": {
    "react-redux": "^7.2.4",
    "redux": "^4.1.0",
    "zzy-javascript-devtools": "^1.5.2"
  },
  "dependencies": {
    "html2canvas": "^1.4.1",
    "immutable": "^4.0.0",
    "redux-immutable": "^4.0.0",
    "redux-thunk": "^2.4.1",
    "styled-components": "^5.3.5"
  }
}
```

# 想法

在之后用了一次`html2canvas`的节点截图，感觉可以将`canvas.drawImage`步骤改为 html2canvas 会更好一些，但是没有进行尝试，觉得可行。
