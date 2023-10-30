---
highlight: vs
theme: github
---

# 技巧

## 项目规范

- 使用 Hooks，统一使用函数式组件
- 内部状态 Hooks 处理，业务数据统一 redux 管理
- ajax 请求在 actionCreators 中使用 redux-thunk 处理
- 每个页面独立 reducer，最后使用 combineReducer 合并
- 变量统一使用小驼峰；组件，styled-components 中的导出使用大驼峰；contants 中的常量使用全大写
- props 中的数据使用解构分别处理

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecac821b8aef4a62a146e498cead9677~tplv-k3u1fbpfcp-watermark.image?)

- 负责返回 jsx 的函数都在最后面声明，逻辑类函数在上方，避免混乱
- 每个组件使用 React.memo()包裹，使得每次更新前对 props 进行浅对比，避免不必要的更新
- 业务与逻辑拆分，轮子、组件纯函数不参与 redux，业务逻辑在主页面中处理，或者当前 reducer
- 在 request.js 中统一创立接口请求函数，导出供使用。命名规范为 get[关键词]Req 比如：getUserBasicReq

## redux + immutable(下方有关于这个插件的解释)

在主要页面内单独建立 store 文件夹来存放独立的 reducer，简单页面直接在 jsx 最上方进行开发

页面中的 store 有

- index.js
  用于导出 reducer 和其他方法数据
- constants.js
  导出 redux 中使用的变量名称

```js
export const CHANGE_ALBUM_LIST = "album/CHANGE_ALBUM_LIST";

export const CHANGE_ENTER_LOADING = "album/CHANGE_ENTER_LOADING";
```

- actionCreators.js
  导出提供修改数据和调用接口的方法

\
状态改变前缀为 toggle，比如 togglePlayState；数据改变前缀使用 change，比如 changeUserBasic；调用接口函数前缀使用 get，比如 getUserBasic

在传递需要修改的数据时将数据 **immutable** 化

```js
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data: fromJS(data),
});

export const getAlbumList = (id) => {
  return (dispatch) => {
    getAlbumListReq(id)
      .then((res) => {
        dispatch(changeAlbumList(res.playlist));
        dispatch(changeEnterLoading(false));
      })
      .catch((err) => {
        console.error("歌单详情列表获取失败！", err);
      });
  };
};
```

- reducer.js
  集中修改 redux 数据

```js
const defaultState = fromJS({
  albumList: {},
  enterLoading: false,
});

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_ALBUM_LIST:
      return state.set("albumList", action.data);
    case CHANGE_ENTER_LOADING:
      return state.set("enterLoading", action.data);
    default:
      return state;
  }
};

export default reducer;
```

### 流程

在这个项目中的流程还是很规范的，所以简单描述一下流程。

1.constants.js 中创建并导出相关常量

```js
export const CHANGE_ALBUM_LIST = "album/CHANGE_ALBUM_LIST";
```

2.在 actionCreators.js 中引入常量并创建修改数据函数 change[xxx],返回 reducer 函数中需要的对象({type: [常量], data: fromJS(data)})

```js
export const changeAlbumList = (data) => ({
  type: CHANGE_ALBUM_LIST,
  data: fromJS(data),
});
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  // 只有复杂类型才会被immutable化，简单类型即使使用fromJS也不会有变化
  data,
});
```

3.request.js 中创建对应请求函数，将获取到的数据 dispatch 到 reducer 中进行处理

4.在 actionCreators.js 中创建调用接口方法

```js
export const getAlbumList = (id) => {
  return (dispatch) => {
    getAlbumListReq(id)
      .then((res) => {
        dispatch(changeAlbumList(res.playlist));
        // loading控制器
        dispatch(changeEnterLoading(false));
      })
      .catch((err) => {
        console.error("歌单详情列表获取失败！", err);
      });
  };
};
```

5.reducer.js 中利用 switch 根据 constant.js 中的常量 type 分别进行处理，最后导出合并到 store 中

```js
import { CHANGE_ALBUM_LIST, CHANGE_ENTER_LOADING } from "./contants";
import { fromJS } from "immutable";

const defaultState = fromJS({
  albumList: {},
  enterLoading: false,
});

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_ALBUM_LIST:
      return state.set("albumList", action.data);
    case CHANGE_ENTER_LOADING:
      return state.set("enterLoading", action.data);
    default:
      return state;
  }
};

export default reducer;
```

6.在全局 store 中注册 reducer

```js
import { combineReducers } from "redux-immutable";

import { reducer as recommendReducer } from "../application/Recommend/store";
import { reducer as singerReducer } from "../application/Singers/store";

const reducer = combineReducers({
  recommend: recommendReducer,
  singers: singerReducer,
  // ...more reducers
});

export default reducer;
```

7.页面中使用

```js
import React, { memo } from "react";
import { connect } from "react-redux";
import { getAlbumList } from "./store/actionCreators.js";

const xxx = (props) => {
  const { match } = props;
  const { albumListImmutable, enterLoading } = props;
  const { getAlbumListDispatch } = props;

  // 复杂数据不可以直接使用，需要由 immutable 格式转化为 js 才可以使用
  const albumList = albumListImmutable?.toJS() || [];

  useEffect(() => {
    getAlbumListDispatch(match.params.id);
  }, []);
};

const mapStateToProps = (state) => ({
  albumListImmutable: state.getIn(["album", "albumList"]),
  // 只有复杂类型才会被immutable化，简单类型不需要被immutable
  enterLoading: state.getIn(["album", "enterLoading"]),
});

const mapDispatchToProps = (dispatch) => ({
  getAlbumListDispatch(id) {
    dispatch(getAlbumList(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(xxx));
```

## 使用 react-router-config 配置路由

可以简化路由的配置
example:

```js
const routes = [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => <Redirect to={"/recommend"} />,
      },
      {
        path: "/recommend",
        component: Recommend,
        routes: [
          {
            path: "/recommend/:id",
            component: Album,
          },
        ],
      },
    ],
  },
];
```

**使用**

有一点需要着重强调：**_renderRouters 只渲染一层路由，如果有深层的需要在对应页面重新调用_**

```js
// APP.jsx
import { renderRoutes } from "react-router-config";
function App() {
  return (
    <Provider store={store}>
      <HashRouter>{renderRoutes(routes)}</HashRouter>
    </Provider>
  );
}
// Recommend/index.jsx
import React, { memo } from "react";
import { renderRoutes } from "react-router-config";

const Recommend = (props) => {
  const { route, history } = props;
  const goNewPage = (id) => {
    history.push(`/recommend/${id}`);
  };
  rerurn(
    <div id="recommendWrap">
      <div onClick={() => goNewPage(-1)}></div>
      {renderRoutes(route.routes)}
    </div>
  );
};
export default memo(Recommend);
```

## css 基础配置(全局)

```css
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
html,
body {
  background: #f2f3f4;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
a {
  text-decoration: none;
  color: #fff;
}
```

## forwardRef(引用传递) & useImperativeHandle 搭配

引用传递（Ref forwading）是一种通过组件向子组件自动传递  **引用 ref** 的技术。
useImperativeHandle 可以让你在使用 ref 时**自定义暴露**给父组件的实例值。

目的： 给父组件提供自身的方法以调用，比如在父组件内调用子组件 ref 暴露出的方法，以操作子组件内的逻辑

使用：

```js
// 子组件
import React, { forwardRef, useImperativeHandle, useRef, memo } from 'react'
const SearchInp = forwardRef((props, ref) => ({
    const inputRef = useRef()
    useImperativeHandle(ref, () => {
        // 暴露给外部的方法在此编写
        // 聚焦input
        getFocus(){
            inputRef && inputRef.current.focus()
        }
    })
    return (
        <input ref={inputRef} />
    )
}))

export default memo(SearchInp)
```

```js
// 父组件
const xxx = (props) => {
  const searchInpRef = useRef();

  const getInpFocus = () => {
    // 调用子组件暴露在外的方法，使其聚焦
    searchInpRef.current.getFocus();
  };

  return <SearchInp ref={searchInpRef} />;
};

export default memo(xxx);
```

## useCallback 优化

传递给子组件的函数使用 useCallback 包裹

第一个参数：依赖数据变动之后的回调\
第二个参数：依赖数据，以数组包括多个

example:

```jsx
const handleBack = useCallback(() => {
  setShowStatus(false);
}, []);

const handleScroll = useCallback(
  (pos) => {
    // ...some code
  },
  [albumListJS]
);
```

如果不用 useCallback 包裹，父组件每次执行时会生成不一样的 handleBack 和 handleScroll 函数引用，那么子组件每一次 memo 的结果都会不一样，导致不必要的重新渲染，也就浪费了 memo 的价值。\
因此 useCallback 能够帮我们在依赖不变的情况保持一样的函数引用，最大程度地节约浏览器渲染性能。

useMemo 与 useCallback 区别
共同作用：\
1.仅仅  `依赖数据`  发生变化, 才会重新计算结果，也就是起到缓存的作用。

两者区别：\
1.`useMemo`  计算结果是  `return`  回来的值, 主要用于 缓存计算结果的值 ，应用场景如： 需要 计算的状态\
2.`useCallback`  计算结果是  `函数`, 主要用于 缓存函数，应用场景如: 需要缓存的函数，因为函数式组件每次任何一个 state 的变化 整个组件 都会被重新刷新，一些函数是没有必要被重新刷新的，此时就应该缓存起来，提高性能，和减少资源浪费。

**useMemo 使用**

```jsx
const Child = memo(({ data }) => {
  console.log("child render...", data.name);
  return (
    <div>
      <div>child</div>
      <div>{data.name}</div>
    </div>
  );
});

const Hook = () => {
  console.log("Hook render...");
  const [count, setCount] = useState(0);
  const [name, setName] = useState("rose");

  //不使用useMemo的话，每次创建出来的是一个新的对象
  const data = { name };
  //使用useMemo的话每次对象只创建一次，所以当count改变的时候，Child不会render
  const data = useMemo(() => {
    return {
      name,
    };
  }, [name]);

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>update count </button>
      <Child data={data} />
    </div>
  );
};
```

## 固定定位撑起高度

```css
z-index: 10;
position: fixed;
background: white;
top: 0;
bottom: 0;
width: 100%;
```

## 动画暂停，围绕点

```css
// 围绕点
transform-origin: 位置 位置; // 位置包括 上 下 中 左 右, 还可以进行以值的形式进行
// 设置播放状态
animation-play-state: paused; // 暂停 or running(运行)
```

## e.target 与 e.currentTarget 的区别

[详情](https://blog.csdn.net/magic__man/article/details/51781425)\
结论：e.currentTarget 指的是`注册了事件监听器的对象`，而 e.target 指的是`该对象里的子对象`，也是触发这个事件的对象

## 禁止事件冒泡&捕获

```jsx
const click = (e) => {
  e.stopPropagation();
};
<div onClick={(e) => click(e)}></div>;
```

## 显示富文本内容

```jsx
const getFont = () => {
  return "&#xe653;"
}
const data = '<div>富文本</div>'

<i dangerouslySetInnerHTML={{__html: data 或者 getFont()}}

```

## e.event 与 e.nativeEvent

e.event: 这里的 event 是被`react`封装好的，里面的很多值在你不使用的时侯表面显示是 null 真正获取的时候就有值 比如 e.target 就会显示当前这个元素
e.nativeEvent: 这里展示`原始`的 event

# 插件

## [immutable](https://www.npmjs.com/package/immutable) 不可变数据(^4.0.0-rc.12)

常用的状态管理器与持久性数据结构处理的融合

因为 memo 只会进行浅比较，深层是探查不到的。

immutable 数据一种利用结构共享形成的持久化数据结构，一旦有部分被修改，那么将会返回一个全新的对象，并且原来相同的节点会直接共享。具体点来说，immutable 对象数据内部采用是多叉树的结构，**凡是有节点被改变，那么它和与它相关的所有上级节点都更新。**

如图
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e0b18e4eac54ed58736f5e2502bad0d~tplv-k3u1fbpfcp-zoom-1.image)

### 在 redux 中使用

```
  yarn add redux redux-thunk redux-immutable react-redux immutable -s
```

因为项目中需要用到 immutable.js 中的数据结构，所以合并不同模块 reducer 的时候需要用到 redux-immutable 中的方法

1. 创建 store

```js
import { combineReducer } from "redux-immutable";
const reducer = combineReducer({
  // 添加不同页面内的reducer
});
```

2. index.js 中引入

```js
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import reducer from "./reducer";

// 浏览器插件使用
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
```

### 方法

在项目中使用到的方法也就那么几个，所以学习成本在可接受范围内，而且还可以与 memo 完美对接

- **fromJS()**
  **将 js 数据转化为 immutable 对象**

```js
import { fromJS } from "immutable";
const immutableData = fromJS({
  name: "Arthas",
});
```

- **toJS()**
  **将 immutable 对象转换为 JS 对象**

由 immutable 对象本身调用函数

```js
const dataJS = immutableData.toJS();
```

- **get()/getIn()**
  **获取 immutable 对象属性的值**

```js
// get - 浅层数据获取
const name = immutableData.get("name"); // Arthas
// getIn - 深层数据获取
const immutableObj = fromJS({ a: { b: { c: 1 } } });
// 深层数据 getIn()方法内使用数组，进行取值
const c = immutableObj.getIn(["a", "b", "c"]); // 1
```

- **set()**
  **对 immutable 进行赋值**

```js
immutableData.set("name", "Monica");
```

- **merge()**
  **类似 对象+扩展，相同属性新替换老，否则是追加**

```js
const immutableData2 = fromJS({
  name: "Arthas",
});
immutableData2.merge({
  name: "Monica",
  age: 23,
});
// {name: 'Monica', age: 23}
```

## [styled-components](https://www.npmjs.com/package/styled-components) js 中编写 css(^5.3.3)

使用这种方式来操作 css 我也是第一次使用，但不得不说优势是非常明显的：

- css 代码可以拿到组件上下文来处理逻辑
- 组件拆分更加轻松，利于解耦
- 有效避免重名的问题(随之而来的就是浏览器中调试的时候无法分清哪个是自己要找的盒子，这个的话可以在关键 dom 节点主动添加 class 类来进行甄别)
- 语义化，div 一把撸确实爽，但是有时候只能通过定义的 class 才可以知道这个 dom 的作用是什么，而这个插件可以解决这个问题

vscode 中对此进行支持补全的插件：`vscode-styled-components`

example: 首页

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d92f2e4b00b4005b5f4720d3110e647~tplv-k3u1fbpfcp-watermark.image?)
这个里面除去 Player 其余都是 style.js 中导出的

style.js(这里面的 style 是配置的全局样式，可以直接引入到此处使用)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eafc59d4b6e54fc98948937c27abc02c~tplv-k3u1fbpfcp-watermark.image?)

可以看到可以完全自定义变量名称，看上去一目了然

### 使用

```
yarn add styled-components -S
```

传参在 css 中做逻辑判断的话：

```js
// index.jsx
<Container isPlayer={playerList.toJS().length > 0}></Container>;
// style.js
export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${(props) => (props.isPlayer ? "60px" : "0")};
  z-index: 100;
  background: ${style["background-color"]};
  transform-origin: right bottom;
`;
```

使用箭头函数对 **props** 做出相应的判断返回值即可，非常的方便

- **全局样式引入**

```js
// 全局样式文件.js
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  // some code
`;
// APP.jsx
import { GlobalStyle } from "全局样式文件.js";

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle />
        {/* renderRouters 只渲染一层路由，如果有深层的需要在对应页面重新调用 */}
        {renderRoutes(routes)}
      </HashRouter>
    </Provider>
  );
}
```

与路由同级就好了。

[参考链接：styled-components:前端组件拆分新思路](https://juejin.cn/post/6844903878580764686)

## [better-scroll](https://www.npmjs.com/package/better-scroll) 视图滚动插件(^2.0.0-beta.10)

[参数表](https://blog.csdn.net/qq_26632807/article/details/77856950)

[插件讲解](https://juejin.cn/post/6844903495171063821#heading-6)

```
yarn add better-scroll -S
```

```js
import BScroll from "better-scroll";
const xxx = (props) => {
  // 滚动容器实例
  const scrollRef = useRef();
  const scroll = new BScroll(scrollRef.current, {
    // 这里是配置区域
    scrollX: false, // 是否为横向
    scrollY: true, // 是否为纵向
    probeType: 3, // 1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
    click: true, // better-scroll默认会阻止浏览器的原生 click 事件。当设置为 true， better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
    bounce: {
      // 是否启用回弹动画，可直接设置为true，或者分别设置
      top: true,
      bottom: false,
    },
    mouseWheel: true, // 允许在浏览器上模拟滑动，不设置只能在移动设备上看到效果。
  });
  return (
    <div id="wrapper">
      <div className="scrollContainer" ref={scrollRef}>
        {/* ...some code */}
      </div>
    </div>
  );
};
```

## [react-lazyload](https://www.npmjs.com/package/react-lazyload) 图片懒加载(^3.2.0)

```
yarn add react-lazyload -S
```

```jsx
import LazyLoad from "react-lazyload";

const xxx = (props) => {
  return (
    <LazyLoad placeholder={<img src="这里放占位图" />}>
      <img src="这里放目标图" />
    </LazyLoad>
  );
};
export default xxx;
```

## [react-transition-group](https://www.npmjs.com/package/react-transition-group)(^4.4.2)

利用 transition 进行过渡动画的第三方插件

使用方式

```
yarn add recat-transition-group -S
```

```jsx
import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { Container } from "./style";

const Page = (props) => {
  const cotainerRef = useRef();

  const transitionExited = (e) => {
    console.log("");
  };
  return (
    <CSSTransition
      in={isTransitionShow} // 控制显示与否 boolean
      timeout={300} // 动画时间 ms number
      classNames="fly" // 动画类名组，关于动画的操作都由这个值为基准，下面会有css的示例
      appear="true" // 是否第一次加载该组件时启用相应的动画渲染，css文件中有含有appear的均和此标签相关
      unmountOnExit // 当动画效果为隐藏时，该标签会从dom树上移除，类似js操作
      onExited={transitionExited} // 整个动画出场结束时执行
      // 想要在这个视图上进行回退，不能直接 history.goBack()，而是要操纵 in 的boolean，让回退动画执行。
      // 然后在动画执行完成后，也就是 onExited 方法内进行 goBack 这样才可以保证回退动画的完整性

      // 还有一些其他的操作：onEnter(入场动画第一帧时执行)、onEntering(当入场动画执行到第二帧时执行)、onExit(出场动画第一帧时执行)、onExiting(出场动画第二帧时执行)、onEntered(入场动画结束时触发的钩子)
      nodeRef={cotainerRef} // 与下级dom的ref进行绑定(排除bug)
    >
      <Container ref={cotainerRef}>{/* ...some code */}</Container>
    </CSSTransition>
  );
};

export default memo(Page);
```

```js
// style.js
import styled from "styled-components";

export const Container = styled.div`
  // 固定定位是保证动画所在的视图永远在最上面
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: ${style["background-color"]};

  // 以下是从右至左平滑动画
  // 确定操纵动画的圆心
  transform-origin: right bottom;
  // fly与上文的classNames相对应，然后 -enter 是动画进行的不同状态
  &.fly-enter,
  &.fly-appear {
    transform: translate3d (100%, 0, 0);
  }
  // active是完成
  &.fly-enter-active,
  &.fly-appear-active {
    transition: transform 0.3s;
    transform: translate3d (0, 0, 0);
  }
  &.fly-exit {
    transform: translate3d (0, 0, 0);
  }
  &.fly-exit-active {
    transition: transform 0.3s;
    transform: translate3d (100%, 0, 0);
  }

  // 以下是从右下滑动旋转切入到可视区域
  transform-origin: right bottom;
  &.fly-enter,
  &.fly-appear {
    transform: rotateZ (30deg) translate3d (100%, 0, 0);
  }
  &.fly-enter-active,
  &.fly-appear-active {
    transition: transform 0.3s;
    transform: rotateZ (0deg) translate3d (0, 0, 0);
  }
  &.fly-exit {
    transform: rotateZ (0deg) translate3d (0, 0, 0);
  }
  &.fly-exit-active {
    transition: transform 0.3s;
    transform: rotateZ (30deg) translate3d (100%, 0, 0);
  }
`;
```

## [create-keyframe-animation](https://www.npmjs.com/package/create-keyframe-animation) js 实现帧动画(^0.1.0)

# 方法

## 扩大可点击区域

```js
const extendClick = () => {
  return `
    position: relative
    &:before {
      content: '';
      position: absolute;
      top: -10px;
      bottom: -10px;
      right: -10px;
      left: -10px;
    }
  `;
};
```

## 防抖

```js
const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      clearTimeout(timer);
    }, delay);
  };
};
```

### 使用

```js
import { debounce } from "utils";
// useMemo包裹 每100ms触发一次
const handleScrollDebounce = useMemo(() => {
  return debounce(handleScroll, 100);
}, [handleScroll]);
```

## ajax 封装

## 判断对象是否为空

```js
const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;
```

## js 添加 css 前缀

`postcss`是不管 js 中添加的 css 样式的，所以如果要在 js 中添加一些 css，就得手动加一些处理：

```js
// js中添加的css不会有process处理(浏览器兼容),需要自行处理
const elementStyle = document.createElement("div").style;

const vendor = (() => {
  // 通过transition确认浏览器
  const transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransfrom",
    ms: "msTransform",
    standard: "Transform",
  };
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

export const prefixStyle = (style) => {
  if (vendor === false) {
    return false;
  }
  if (vendor === "standard") {
    return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
};
```

使用

```jsx
import { prefixStyle } from "utils";

const transform = prefixStyle("transform");

domRef.current.style[transform] = `translate3d (${x}px, ${y}px, 0)`;
```

## 歌词解析(可以是一个插件)

显示当前的歌词，支持倍速播放，\
歌词 mock 数据：

```js
// 前面的数组代表分:秒:毫秒，后面的是歌词
lyric = `
  [00:00.000] 作词 : 唐恬
  [00:00.288] 作曲 : 钱雷
  [00:00.576] 编曲 : 钱雷
  [00:00.864] 制作人 : 钱雷
  [00:01.152] 吉他：高飞
`;
```

### 总览

```js
// 解析 [00:01.997] 这一类时间戳的正则表达式
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;

// 播放状态
const STATE_PAUSE = 0;
const STATE_PLAYING = 1;

export default class Lyric {
  /**
   * @params {string} lrc 歌词字符串
   * @params {function} handler 回调
   * @params {number} speed 倍速
   */
  constructor(lrc = "", handler = () => {}, speed = 1) {
    this.lrc = lrc;
    this.handler = handler;
    this.lines = []; // 解析后的数组
    this.state = STATE_PAUSE; // 播放状态
    this.curLineIndex = 0; // 当前选中歌词
    this.startStamp = 0; // 当前时间戳
    this.speed = speed; // 播放速率
    this._initLines();
  }
  // 初始化解析歌词
  _initLines() {
    const lines = this.lrc.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let result = timeExp.exec(line);
      if (!result) continue;
      const txt = line.replace(timeExp, "").trim();
      if (txt) {
        if (result[3].length === 3) {
          result[3] = result[3] / 10; //[00:01.997] 中匹配到的 997 就会被切成 99
        }
        this.lines.push({
          time:
            result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10, // 转化具体到毫秒的时间，result [3] * 10 可理解为 (result / 100) * 1000
          txt,
        });
      }
    }
    this.lines.sort((a, b) => a.time - b.time);
  }
  /**
   *
   * @param {number} offset : 时间进度;
   * @param {boolean} isSeek : 是否为用户手调进度
   */
  play(offset = 0, isSeek = false) {
    if (!this.lines.length) return;
    this.state = STATE_PLAYING;
    // 找到当前所在行
    this.curLineIndex = this._findCurLineIndex(offset);
    // 现在处于 this.curLineIndex - 1,将歌词传递出去
    this._callHandle(this.curLineIndex - 1);
    // 获取到歌曲开始播放的时间 当前时间 - 已播放长度
    this.startStamp = +new Date() - offset;
    if (this.curLineIndex < this.lines.length) {
      clearTimeout(this.timer);
      // 继续播放
      this.playRest(isSeek);
    }
  }
  // 继续播放，isSeek和play的isSeek一致
  playRest(isSeek = false) {
    const line = this.lines[this.curLineIndex];
    let delay;
    if (isSeek) {
      // 距离下一行播放的时间间隔 = 在整首歌内下一行的时间长 - (当前时间 - 歌曲播放时间)
      delay = line.time - (+new Date() - this.startStamp);
    } else {
      // 从上一行时间戳开始计算到下一行的间隔
      let preTime = this.lines[this.curLineIndex - 1]
        ? this.lines[this.curLineIndex - 1].time
        : 0;
      delay = line.time - preTime;
    }
    // 延迟一定的时间之后转至下一行歌词
    this.timer = setTimeout(() => {
      this._callHandle(this.curLineIndex++);
      if (
        this.curLineIndex < this.lines.length &&
        this.state === STATE_PLAYING
      ) {
        this.playRest();
      }
      // 除以倍速获取正确的歌词
    }, delay / this.speed);
  }
  // 播放暂停控制器
  togglePlay(offset) {
    if (this.state === STATE_PLAYING) {
      this.stop();
    } else {
      this.state = STATE_PLAYING;
      this.play(offset, true);
    }
  }
  stop() {
    this.state = STATE_PAUSE;
    // 清理timer，结束换行
    clearTimeout(this.timer);
  }
  // 手调进度，传入调整的长度以及 isSeek为true即可
  seek(offset) {
    this.play(offset, true);
  }
  // 改变播放速度
  changeSpeed(speed) {
    this.speed = speed;
  }
  // 找到当前所在行
  _findCurLineIndex(time) {
    for (let i = 0; i < this.lines.length; i++) {
      // for 找到最后一个符合判断的 i 返回，反之返回len - 1
      if (time <= this.lines[i].time) {
        return i;
      }
    }
    return this.lines.length - 1;
  }
  // 统一的回调
  _callHandle(i) {
    if (i < 0) return;
    // console.log(i);
    this.handler({ txt: this.lines[i].txt, lineNum: i });
  }
}
```

### 使用

```js
import Lyric from "../../api/lyric-parser";
import * as actionCreators from "./store/actionCreators";

const lyricStr = `
  [00:00.000] 作词 : 唐恬
  [00:00.288] 作曲 : 钱雷
  [00:00.576] 编曲 : 钱雷
  [00:00.864] 制作人 : 钱雷
  [00:01.152] 吉他：高飞
`;

const Player = (props) => {
  const { speed } = props; // 从mapStateProps中获取，是保存全局的，默认1，可取 0.75 | 1 | 1.25 | 1.5 | 2
  // 即时歌词-单行
  const [playingLyric, setPlayingLyric] = useState("");
  // 当前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  // 总长度
  const [duration, setDuration] = useState(0);
  // 是否已准备就绪
  const [songReady, setSongReady] = useState(true);

  // useState 的值改变之后,整个试图会重新渲染. 而useRef不会.. 如果lyric用的是useState的话. 那每次更改lyric对象实例的curLineIndex的值都会造成视图重新渲染.这显然不是我们想要的
  // Lyric class类
  const currentLyric = useRef(null);
  // audio ref
  const audioRef = useRef();
  // 歌词行数
  const currentLineNum = useRef();

  // 进度
  const percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  useEffect(() => {
    // 过滤异常情况 播放列表无长度，播放歌曲下标为-1，当前选中歌曲数据错误，选中歌曲id与记录选中歌曲相同，歌曲未准备好(下文讲述)
    if (
      !playListJS.length ||
      currentIndex === -1 ||
      !playListJS[currentIndex] ||
      playListJS[currentIndex].id === preSong.id ||
      !songReady
    )
      return;
    // 拿到当前选中歌曲信息
    const current = playListJS[currentIndex];
    // 记录选中歌曲
    setPreSong(current);
    // 进入判断之后判负，目前不允许切换歌曲
    setSongReady(false);
    // 将歌曲信息存储至redux
    changeCurrentSongDispatch(current);
    // audio赋值
    audioRef.current.src = getSongUrl(current.id);
    playControlTimer = setTimeout(() => {
      // 从 audio 标签拿到 src 加载到能够播放之间有一个缓冲的过程，只有当控件能够播放时才能够切到下一首。如果在这个缓冲过程中切歌就会报错。
      audioRef.current.play().then(() => {
        // 正常之后再允许切歌，这时候已经准备好了
        setSongReady(true);
      });
      clearTimeout(playControlTimer);
    });
    // 设置倍速
    audioRef.current.playbackRate = speed;
    // 设置播放状态
    togglePlayStateDispatch(true);
    // 重置
    setCurrentTime(0);
    // 获取歌词
    getLyric(current.id);
    setDuration((current.dt / 1000) | 0);
    // 播放列表改变或者播放下标改变时调用
  }, [playListJS, currentIndex]);

  const getLyric = async (id) => {
    let lyric = "";
    if (currentLyric.current) {
      currentLyric.current.stop();
    }
    const res = await getLyricReq(id);
    // lyric = res.lyric
    lyric = lyricStr; // 使用mock数据
    if (!lyric) {
      currentLyric.current = null;
      return;
    }
    // 在这里调用接口获取歌词，这里就直接赋值了
    currentLyric.current = new Lyric(lyric, handleLyric, speed);
    // 播放
    currentLyric.current.play();
    // 重置歌词进度
    currentLineNum.current = 0;
    // 重置滑动进度
    currentLyric.current.seek(0);
  };

  // audio 音频时间更新
  const audioTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  // lyric Class的回调
  const handleLyric = ({ txt, lineNum }) => {
    if (!currentLyric.current) return;
    // 同步当前行
    currentLineNum.current = lineNum;
    // 保存当前行歌词
    setPlayingLyric(txt);
  };

  // 进度条变化(这里只说明不同情况下对歌词的处理)
  // 进度条变化
  const onProgressChange = (p) => {
    // p 代表进度 percent, 0 < p < 1, typeof p === number
    // 获取最新进度
    const newTime = p * duration;
    setCurrentTime(newTime);
    // 同步至audio
    audioRef.current.currentTime = newTime;
    // 如果当前处于暂停，那么就切换播放状态，进行播放
    if (!playing) {
      togglePlayStateDispatch(true);
    }
    // 同步歌词
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  };
  // 切换播放状态
  const clickPlaying = (e, bol) => {
    e.stopPropagation();
    togglePlayStateDispatch(bol);
    // 状态同步歌词
    if (currentLyric.current) {
      currentLyric.current.togglePlay(currentTime * 1000);
    }
  };
  // 播放结束
  const handleEnd = () => {
    // 判断当前歌曲循环状态，单曲循环的话走if，否则走else
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };
  //
  return (
    <audio
      src=""
      ref={audioRef}
      onTimeUpdate={audioTimeUpdate}
      onEnded={handleEnd}
    />
  );
};

const mapStateToProps = (state) => ({
  speed: state.getIn(["player", "speed"]),
});

const mapDispatchToProps = (dispatch) => ({
  changeSpeedDispatch(data) {
    dispatch(actionCreators.changeSpeed(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(Player));
```

# 组件(css 部分全部使用 styled-components )

## Loading 加载提示

控制 Loading 的显示时，最好使用 redux 控制每一个页面的 Loading 组件，将它们区分开来

```jsx
import React, { memo } from "react";
import styled, { keyframes } from "styled-components";
// 全局样式
import style from "../../../global-style";

// 给动画添加补帧效果
const loading = keyframes`
  0%, 100% {
    transform: scale(0.0);
  }
  50% {
    transform: scale(1.0);
  }
`;

const LoadingWrapper = styled.div`
  > div {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    margin: auto;
    width: 60px;
    height: 60px;
    opacity: 0.6;
    border-radius: 50%;
    background-color: ${style["theme-color"]};
    animation: ${loading} 1.4s infinite ease-in;
  }
  > div:nth-child(2) {
    // 提前 .7s 执行
    animation-delay: -0.7s;
  }
`;

const Loading = ({ show }) => {
  return (
    <LoadingWrapper style={show ? { display: "" } : { display: "none" }}>
      <div></div>
      <div></div>
    </LoadingWrapper>
  );
};

Loading.defaultProps = {
  show: true, // 控制显示与否
};

Loading.propTypes = {
  show: PropTypes.bool,
};

export default memo(Loading);
```

## Scroll 滚动

### **代码**

```js
import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import BScroll from "better-scroll";
import styled from "styled-components";
import { debounce } from "../../api/utils";
import Loading from "../Loading";

const ScrollSty = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Scroll = forwardRef((props, ref) => {
  // 参数
  const {
    direction,
    click,
    refresh,
    bounceTop,
    bounceBottom,
    pullUpLoading,
    pullDownLoading,
  } = props;

  // 函数
  const { pullUp, pullDown, onScroll } = props;

  // 指向需要scroll组件的ref
  const scrollRef = useRef();

  // better-scroll 实例对象
  const [bScroll, setBScroll] = useState();

  // 防抖处理
  const pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300);
  }, [pullUp]);
  const pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300);
  }, [pullDown]);

  // 初始化创建 better-scroll 实例
  useEffect(() => {
    const scroll = new BScroll(scrollRef.current, {
      scrollX: direction === "horizontal",
      scrollY: direction === "vertical",
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      },
      // chrome 模拟滚动
      mouseWheel: true,
    });
    setBScroll(scroll);
    return () => {
      // 销毁时清理实例
      setBScroll(null);
    };
  }, []);

  // 获取数据之后重新刷新高度，获取最新的滚动条
  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh();
    }
  });

  // 绑定scroll实例
  useEffect(() => {
    if (!onScroll || !bScroll) return;
    bScroll.on("scroll", (scroll) => {
      onScroll(scroll);
    });
    return () => {
      bScroll.off("scroll");
    };
  }, [onScroll, bScroll]);

  // 上拉到底
  useEffect(() => {
    if (!pullUp || !bScroll) return;
    bScroll.on("scrollEnd", () => {
      // 超越临界点判断
      // 上拉时为负值
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce();
      }
    });
    return () => {
      bScroll.off("scrollEnd");
    };
  }, [pullUp, bScroll, pullUpDebounce]);

  // 下拉到顶
  useEffect(() => {
    if (!pullDown || !bScroll) return;
    bScroll.on("touchEnd", () => {
      if (bScroll.y > 50) {
        pullDownDebounce();
      }
    });
    return () => {
      bScroll.off("touchEnd");
    };
  }, [pullDown, bScroll, pullDownDebounce]);

  useImperativeHandle(ref, () => ({
    // 刷新scroll
    refresh() {
      if (!bScroll) return;
      bScroll.refresh();
      bScroll.scrollTo(0, 0);
    },
    // 拿到scroll实例
    getScroll() {
      if (bScroll) {
        return bScroll;
      }
    },
  }));
  return <ScrollSty ref={scrollRef}>{props.children}</ScrollSty>;
});

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true,
};
Scroll.propTypes = {
  direction: PropTypes.oneOf(["vertical", "horizontal"]), // 滚动的方向
  refresh: PropTypes.bool, // 是否刷新
  onScroll: PropTypes.func, // 滑动触发的回调函数
  pullUp: PropTypes.func, // 上拉加载逻辑
  pullDown: PropTypes.func, // 下拉加载逻辑
  pullUpLoading: PropTypes.bool, // 是否显示上拉 loading 动画
  pullDownLoading: PropTypes.bool, // 是否显示下拉 loading 动画
  bounceTop: PropTypes.bool, // 是否支持向上吸顶
  bounceBottom: PropTypes.bool, // 是否支持向下吸底
};

export default Scroll;
```

### tsx 版本

```tsx
import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  useMemo
} from 'react'
import BScroll from 'better-scroll'
import styled from 'styled-components'
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'

const ScrollSty = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const debounce: Debounce = (func, wait) => {
  let timer: NodeJS.Timeout
  return function (...args: any) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
      clearTimeout(timer)
    }, wait);
  }
}

const ScrollLoadingBarV2 = forwardRef((props: Props, ref) => {
  // 参数
  const {
    direction,
    click,
    refresh,
    bounceTop,
    bounceBottom,
    pullUpLoading,
    pullDownLoading
  } = props

  // 函数
  const { pullUp, pullDown, onScroll } = props

  // 指向需要scroll组件的ref
  const scrollRef = useRef<any>(null)

  // better-scroll 实例对象
  const [bScroll, setBScroll] = useState<BScrollConstructor>()

  // 防抖处理
  const pullUpDebounce = useMemo(() => {
    return debounce((pullUp as Function), 300)
  }, [pullUp])
  const pullDownDebounce = useMemo(() => {
    return debounce((pullDown as Function), 300)
  }, [pullDown])

  // 初始化创建 better-scroll 实例
  useEffect(() => {
    const scroll = new BScroll((scrollRef?.current), {
      scrollX: direction === 'horizontal',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      },
      // chrome 模拟滚动
      mouseWheel: true
    })
    if (!bScroll) {
      setBScroll(scroll)
    }
    return () => {
      // 销毁时清理实例
      setBScroll(undefined)
    }
  }, [])

  // 获取数据之后重新刷新高度，获取最新的滚动条
  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })

  // 绑定scroll实例
  useEffect(() => {
    if (!onScroll || !bScroll) return
    bScroll.on('scroll', (scroll: any) => {
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scroll')
    }
  }, [onScroll, bScroll])

  // 上拉到底
  useEffect(() => {
    if (!pullUp || !bScroll) return
    bScroll.on('scrollEnd', () => {
      // 超越临界点判断
      // 上拉时为负值
      if (bScroll.y <= bScroll.maxScrollY + 100) {

        pullUpDebounce()
      }
    })
    return () => {
      bScroll.off('scrollEnd')
    }
  }, [pullUp, bScroll, pullUpDebounce])

  // 下拉到顶
  useEffect(() => {
    if (!pullDown || !bScroll) return
    bScroll.on('touchEnd', () => {
      if (bScroll.y > 50) {
        pullDownDebounce()
      }
    })
    return () => {
      bScroll.off('touchEnd')
    }
  }, [pullDown, bScroll, pullDownDebounce])

  useImperativeHandle(ref, () => ({
    // 刷新scroll
    refresh() {
      if (!bScroll) return
      bScroll.refresh()
      bScroll.scrollTo(0, 0)
    },
    // 拿到scroll实例
    getScroll() {
      if (bScroll) {
        return bScroll
      }
      return null
    }
  }))
  return (
    <ScrollSty ref={scrollRef}>
      {props.children}
    </ScrollSty>
  )
})


type Debounce = (func: Function, wait: number) => Function

interface Props {
  [key: string]: any,
  direction?: 'vertical' | 'horizontal',
  click?: boolean,
  refresh?: boolean,
  onScroll?: Function | null,
  pullUpLoading?: boolean,
  pullDownLoading?: boolean,
  pullUp?: Function | null,
  pullDown?: Function | null,
  bounceTop?: boolean,
  bounceBottom?: boolean
}

ScrollLoadingBarV2.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
}

export default ScrollLoadingBarV2


// 使用

<ScrollLoadingBarV2
  direction='vertical'
>
  <div>
    {Array(100).fill(null).map((item, index) => (
      <div className="line" key={index}>{index}</div>
    ))}
  </div>
</ScrollLoadingBarV2>
```

### **使用**

```js
import styled from "styled-components";
import Scroll from "../components/Scroll";

const Content = styled.div`
  height: 100vh;
  width: 100%;
`;
const xxx = (props) => {
  return (
    <Content>
      <Scroll>
        <div>{/* ...some code */}</div>
      </Scroll>
    </Content>
  );
};
export default memo(xxx);
```

css 中 fixed 是项目需要，使用 scroll 组件时需要保证父容器的高度足够撑起，才可以正常滚动。就是在容器元素高度固定，当子元素高度超过容器元素高度时，通过 transfrom 动画产生滑动效果，因此它的使用原则就是外部容器必须是固定高度，不然没法滚动

## 环形进度条(ProgressCircle)

```jsx
import React, { memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import style from "../../assets/global-style";

const CircleWrapper = styled.div`
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: ${style["theme-color-shadow"]};
    }
    &.progress-bar {
      stroke: ${style["theme-color"]};
      transform: scale(0.9) rotate(-90deg);
    }
  }
`;

const ProgressCircle = (props) => {
  // 大小，进度
  const { radius, percent } = props;
  // 背景周长
  const dashArray = Math.PI * 100;
  // 没有高亮的部分，剩下高亮的就是进度
  const dashOffset = (1 - percent) * dashArray;

  return (
    <CircleWrapper>
      <svg
        width={radius}
        height={radius}
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="progress-background"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
        ></circle>
        {/* https://www.cnblogs.com/daisygogogo/p/11044353.html */}
        <circle
          className="progress-bar"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        ></circle>
      </svg>
      {props.children}
    </CircleWrapper>
  );
};

ProgressCircle.defaultProps = {
  radius: 0,
  percent: 0,
};

ProgressCircle.propTypes = {
  // 宽高
  radius: PropTypes.number,
  // 进度 = 当前进度 / 总进度    进度 < 1
  percent: PropTypes.number,
};

export default memo(ProgressCircle);
```

### 使用

```js
<ProgressCircle radius={32} percent={实际进度}>
  {/* 内部放一些图标什么的 */}
</ProgressCircle>
```
