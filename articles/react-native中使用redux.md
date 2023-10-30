---
theme: github
---

# 说明

**首先 redux 不是每个项目都会用到的。这个插件主要服务于中大型项目，内部有复杂的页面结构以及频繁的更新状态，这个时候当前页面内的状态会非常乱且难以维护，这时候就需要以集中处理的方式去整理 state，redux 就可以拿来用**

# 安装

redux - 本体

react-redux - 依赖

redux-thunk - 让 redux 有异步的 action 事务

# 核心关键词、方法

## action

描述：**action**  是一个具有  `type`  字段的普通 JavaScript 对象。**你可以将 action 视为描述应用程序中发生了什么的事件**

type 字段为必填，若有附加信息，则添加到第二个字段 `payload` 当中

example：

```js
const calculatorAddAction = {
  type: "add",
  payload: "calculator add 1",
};
```

## reducer

描述：**reducer**  是一个函数，接收当前的  `state`  和一个  `action`  对象，必要时决定如何更新状态，并返回新状态。函数签名是：`(state, action) => newState`。 **你可以将 reducer 视为一个事件监听器，它根据接收到的 action（事件）类型处理事件。**
reducer 需要符合以下规则：

- 仅使用  `state`  和  `action`  参数计算新的状态值
- 不能直接修改 state，需要以复制的方式代替旧的 state(扩展运算符, concant) 保证其 _不可变更新（immutable updates）_
- 不允许使用异步，依赖随机值或其他导致产生 ‘副作用’ 的代码

reducer 函数内部逻辑需要遵循以下规则：

- 如果没有进任何判断进行更新 state，那么默认返回 state

内部可以使用 if-else 或者 switch 等循环判断
example

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe84ea7a930141f28cabe2925f4cc8fd~tplv-k3u1fbpfcp-watermark.image?)

### combineReducers

描述：可以将单个 reducer 分成多个不同组件的 reducer，最后通过 combineReducers 方法进行整合

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce0caba524ff4105834ffa1cadf40587~tplv-k3u1fbpfcp-watermark.image?)

## dispatch()

描述：**更新 state 的唯一方法是调用  `store.dispatch()`**
内部传入一个`action`对象。store 将执行所有 reducer 函数并计算出更新后的 state，调用  `getState()`  可以获取新 state。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f2b779aa0b74886abf58c5d51de7f5b~tplv-k3u1fbpfcp-watermark.image?)

## store

描述：当前 Redux 应用的状态存在于一个名为  **store**  的对象中。

**_Store 全局唯一的一个对象 可以看作应用 state 的集合 , 也就是说你在任意组件中都可以通过 store 拿到你想要的 state_**

### Provider

在入口文件中使用 `Provider` 包裹住 `App`，并且传入 `store` 即可在全局拿到 redux 中存储的所有状态

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/740f21bec2274e6fb4ceb118ed3dcdc3~tplv-k3u1fbpfcp-watermark.image?)

### redux-thunk

reducer 是一个纯函数，不应该修改传入的参数，不应该有执行有副作用的 API 请求和路由跳转，不能调用非纯函数。只要传入参数相同，返回计算得到的下一个 state 就一定相同，单纯执行计算。
通过 redux-thunk 可以让 action 异步执行，action 创建函数除了返回 action 对象外还可以返回函数，当返回函数时，这个函数会被执行，接收一个参数为 dispatch。这个函数并不需要保持纯净。

## connect

描述：在当前页面中绑定数据到 store。connect 需要 mapStateToProps 方法返回的一个 Reducer，mapStateToProps 方法有个参数 state，这个是 Store 统一管理的 state，也就是根节点。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59d93b0fb8fe408dac49c52dd855a0f7~tplv-k3u1fbpfcp-watermark.image?)

### mapStateToProps(state, ownProps)

描述：允许我们将 store 中的数据作为 props 绑定到组件上

`state` 是 Redux 的 store,从中摘取 calculator 到 props 中
`ownProps` 是组件自己的 props

### mapDispatchToProps(dispatch, ownProps)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4f6e19e55d349f694a06c284f8d7f0f~tplv-k3u1fbpfcp-watermark.image?)
在组件的 props 中直接执行 return 出的方法即执行 dispatch

# 执行流程

页面内点击按钮触发事件，事件方法内执行对应的 dispatch，传入相应的 action 作为 type。reducer 中监听，传入 type，根据 if-else 判断进入对应的逻辑处理，return 出 state 的复制体，更新 state。 connect 中的 mapStateToProps 中的 state 参数更新拿到最新的 state，随后 return 内的参数更新到组件的 props 当中。

# example&使用(加减计算器)

## 目录结构

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cafe971a74fd470ba28af4b5cf2b4b84~tplv-k3u1fbpfcp-watermark.image?)

## action

### actionType.js

专门用于存放 action 中用到的 type，便于管理

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53c7aa26239948198b0162d3509b5264~tplv-k3u1fbpfcp-watermark.image?)

### CalculatorAction.js

处理某个页面内的 action。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b60444d0180042298105e06d3a18cd3f~tplv-k3u1fbpfcp-watermark.image?)

函数内 return 出该 aciton 内用到的 type，这样虽然麻烦，但是胜在清晰，包括以后要添加 payload 参数的话
导出 action 处理函数在组件内使用，这里的`t`是组件中传入的 type 用于在此函数中。
return 后箭头函数内的`dispatch`参数是组件中进行`connect`之后就可以获取到了。

然后根据组件中传入的`t`判断不同场景分别进行不同的`dispatch`

## reducer

### calculatorReducer.js

这里处理 action 中调用的 dispatch 方法

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/826eba29d6304950bbadf894008e8c4a~tplv-k3u1fbpfcp-watermark.image?)

根据 actionType 中定义的 type 进行不同的处理。
并导出该页面的 reducer 函数

### reducer/index.js

使用 `combineReducers` 函数将不同组件的 reducer 组合到一起

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/719b2026d5994cdaa2f36b7bf3742d37~tplv-k3u1fbpfcp-watermark.image?)

并导出组合之后的 `rootReducer`

## store.js

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcda66d94b8f4923989f2f576184ef7e~tplv-k3u1fbpfcp-watermark.image?)
使用 redux 提供的`applyMiddleware`方法添加 redux-thunk，并导出创建的 store。
rootReducer 作为 createStore 函数(此时已经是添加完中间件的新方法)的参数使用

## index.js(入口文件)

使用 react-redux 提供的 `Provider` 组件对 App 组件进行包裹，并传入 store 使得全局可拿到 sotre 内的数据

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb39e571226b4b6984fe57eb69266968~tplv-k3u1fbpfcp-watermark.image?)

## view/redux.js(使用到 redux 的组件)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db88d2e4ffc746ef87334c23451a0e1e~tplv-k3u1fbpfcp-watermark.image?)

首先使用 connect 将组件和 store 链接起来，使得在 props 中获取到 dispatch。 connect 中传入 mapStateToProps 函数，该函数内的 state 中拿到该组件需要用到的目标参数`calculator`并 return 出去，这时在 props 中即可拿到。

页面中引入当前页面的 action，然后在按钮点击事件中 dispatch 一个 action 函数，该函数内传入对应的 action 中定义的参数。

# 结语

到这里整个流程就跑通了，此为初始。然后这里建议在安装插件的时候注意一下安装版本，最好在 npm 中看一下常用版本使哪个并安装此版本。
