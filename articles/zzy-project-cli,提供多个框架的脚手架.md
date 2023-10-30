---
highlight: monokai
theme: github
---

[npm 地址](https://www.npmjs.com/package/zzy-project-cli)

# install

```
npm install zzy-project-cli -g
```

# 做什么？

- 将多个可选的框架提供给使用者选择，选中后自动下载对应模板，快捷使用。

# 使用

## step1

```
zzy-cli create [项目名称]
```

## step2

获取模板之后选取任一进行下载

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e50c1d720c0448db04c80d5ebdbfa77~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=620&h=292&s=78401&e=png&b=0d2a35)

下载完成之后即可使用

# 模板介绍

- 模板组是由新旧多个不同的框架集合成的，vite 类为最新开发产出的框架，webpack 为去年及更早开发产出。
- vite 由 vue，react 分别对应 PC 管理端，Mobile 业务页面，总计四个模板可以使用，且全部为 ts 开发。
- webpack 模板三种，分别是 vue-self-admin，简单二次修改后的 vue-element-admin 框架，vue 版本为 2x，react_mobile 为 js，一代产出的框架，css 为 less，v2 是 ts 开发，css 为 styled-components。
- vite 的模板全部都是精装，react 系列有骨架屏，错误报告，等等，vue 有权限验证，icon 组件等预装内容，webpack 相对比较简陋一些。
- webpack 的框架作为上一代内容不再维护，vite 长期维护。
- 以下为各个框架的 readme.md 内容

## [vite_react_management](https://github.com/Weibienaole/zProject_vite_react_management)

### 技术栈

- Vite@4
- React
- react-router@6
- antd-mobile@5
- redux&immutable
- styled-components
- eslint&prettier

### 点

- 默认具备骨架屏加载(src/componrnts/LoadSkeleton)、错误边界(只限于在 core 之内，之外额外在 baseRoute 中设置)(src/componrnts/ErrorBoundary)、404(src/views/404)
- 全局已配置的规则，默认开发软件为 VSCode(已设置配置文件)
- store 内的复杂数据一律保证 immutable 化，配合 immutable 处理
- 基本全局配置在 config 中的 env 分别设置
- mobile 下 core 可以什么都不做，只是一个包裹，具体是在其下面做处理
- 默认配置 src 路径别名为 @

### rules

- style 组件默认后缀为 Sty example： home 组件的顶级 style 组件就是

```html
<ContainerSty><ContainerSty /></ContainerSty>
```

- 请求文件统一从 api 中以 views 相同的结构进行创建，使用是以：

```js
import * as api from "@/api/home";

api
  .testApi({
    // ...datas
  })
  .then(console.log);
```

- 项目内默认以驼峰形式开发
- 普通页面的路由存放至 src/router/asyncRoutes
- 使用 redux 存放内容时，规则如下：

```jsx
const Test = (props) => {
	// 对于不同入口进行区分
	const { testObj } = props
	const { setTestObjDispatch } = props
	const { ...otherProps } = props
}

const mapStateToProps = (state) => ({
	testObj: state.getIn(['core', 'testObj']).toJs()
})

const mapDispatchToProps = (dispatch) => ({
	// dispatch方法都要添加后缀进行分辨
	setTestObjDispatch(key) {
		dispatch(setTestObjDis(key))
	}
})

// eslint
const RTest = connect(mapStateToProps, mapDispatchToProps)(Test)
export RTest
```

- 全局样式在 src/style.ts 下，公共样式在 src/utils/global-style.ts 下

## [vite_react_mobile](https://github.com/Weibienaole/zProject_vite_react_mobile)

### 技术栈

- Vite@4
- React
- react-router@6
- antd-mobile@5
- redux&immutable
- styled-components
- eslint&prettier

### 点

- 默认具备骨架屏加载(src/componrnts/LoadSkeleton)、错误边界(只限于在 core 之内，之外额外在 baseRoute 中设置)(src/componrnts/ErrorBoundary)、404(src/views/404)
- 全局已配置的规则，默认开发软件为 VSCode(已设置配置文件)
- store 内的复杂数据一律保证 immutable 化，配合 immutable 处理
- 基本全局配置在 config 中的 env 分别设置
- mobile 下 core 可以什么都不做，只是一个包裹，具体是在其下面做处理
- 默认配置 src 路径别名为 @
- 默认配置对应的 UI 框架 icons 插件

### rules

- style 组件默认后缀为 Sty example： home 组件的顶级 style 组件就是

```html
<ContainerSty><ContainerSty /></ContainerSty>
```

- 请求文件统一从 api 中以 views 相同的结构进行创建，使用是以：

```js
import * as api from "@/api/home";

api
  .testApi({
    // ...datas
  })
  .then(console.log);
```

- 项目内默认以驼峰形式开发
- 普通页面的路由存放至 src/router/asyncRoutes
- 使用 redux 存放内容时，规则如下：

```jsx
const Test = (props) => {
	// 对于不同入口进行区分
	const { testObj } = props
	const { setTestObjDispatch } = props
	const { ...otherProps } = props
}

const mapStateToProps = (state) => ({
	testObj: state.getIn(['core', 'testObj']).toJs()
})

const mapDispatchToProps = (dispatch) => ({
	// dispatch方法都要添加后缀进行分辨
	setTestObjDispatch(key) {
		dispatch(setTestObjDis(key))
	}
})

// eslint
const RTest = connect(mapStateToProps, mapDispatchToProps)(Test)
export RTest
```

- 全局样式在 src/style.ts 下，公共样式在 src/utils/global-style.ts 下

## [vite_vue_management](https://github.com/Weibienaole/zProject_vite_vue_management)

### 技术栈

- Vite@4
- Vue3
- vue-router@4
- element-plus@2
- pinia
- scss
- eslint&prettier

### 点

- 默认具备 KeepAlive、404(src/views/errorPage/404、权限指令（后期根据实际情况更改）)、SideBar、Breadcrumb、Tags
- 路由守卫已经预配置，和登录互相挂钩
- PC 端默认开启路由权限校验，在修改 config/.env.development&.production 中的 VITE_OPEN_PERMISSION 进行修改
- 全局已配置的规则，默认开发软件为 VSCode(已设置配置文件)
- 基本全局配置在 config 中的 env 分别设置
- 默认配置 src 路径别名为 @
- element-plus 组件设置自动导入，直接使用即可，无需引入
- 默认配置对应的 UI 框架 icons 插件
- svg-icon 组件内可直接使用 src/assets/icons 下的 svg

### rules

- 每个页面顶层默认 id 为 [Page]\_Page_Container

```html
<div id="Login_Page_Container"></div>
```

- 每个组件顶层默认 class 为 [Component]\_Component_Container

```html
<div id="Table_Component_Container"></div>
```

- 请求文件统一从 api 中以 views 相同的结构进行创建，使用是以：

```js
import * as api from "@/api/home";

api
  .testApi({
    // ...datas
  })
  .then(console.log);
```

- 项目内默认以驼峰形式开发
- 普通页面的路由存放至 src/router/asyncRoutes
- 全局样式在 src/style.scss 下
- svg 图标存放至 src/assets/icons 中配合 svg-icon 组件使用
- 存储一般通过 src/utils/storage.ts 内提供的方法调用

## [vite_vue_mobile](https://github.com/Weibienaole/zProject_vite_vue_mobile)

### 技术栈

- Vite@4
- Vue3
- vue-router@4
- vant@4
- pinia
- scss
- eslint&prettier

### 点

- 默认具备 KeepAlive、404(src/views/errorPage/404、权限指令（后期还需要根据实际情况更改）)、全局组件 TitleBar/svg-icon
- 路由守卫已经预配置，和登录互相挂钩
- 移动端默认不开启路由权限校验，在修改 config/.env.development&.production 中的 VITE_OPEN_PERMISSION 进行修改
- 全局已配置的规则，默认开发软件为 VSCode(已设置配置文件)
- 基本全局配置在 config 中的 env 分别设置
- 默认配置 src 路径别名为 @
- vant 组件设置自动导入，直接使用即可，无需引入
- 默认配置对应的 UI 框架 icons 插件
- svg-icon 组件内可直接使用 src/assets/icons 下的 svg

### rules

- 每个页面顶层默认 id 为 [Page]\_Page_Container

```html
<div id="Login_Page_Container"></div>
```

- 每个组件顶层默认 class 为 [Component]\_Component_Container

```html
<div id="Table_Component_Container"></div>
```

- 请求文件统一从 api 中以 views 相同的结构进行创建，使用是以：

```js
import * as api from "@/api/home";

api
  .testApi({
    // ...datas
  })
  .then(console.log);
```

- 项目内默认以驼峰形式开发
- 普通页面的路由存放至 src/router/asyncRoutes
- 全局样式在 src/style.scss 下
- svg 图标存放至 src/assets/icons 中配合 svg-icon 组件使用
- 存储一般通过 src/utils/storage.ts 内提供的方法调用

## [webpack5_V2](https://github.com/Weibienaole/zProject_webpack_react_mobile_V2)

### 基于 react webpack 为主的移动端项目基础框架。

### 本项目设置了 DllPlugin(react、react-dom)，在 public 中已经打包了一份，如果更改 webpack 的 Dllplugin 配置，需先 yarn dll 重新进行编译，而后再 yarn build

### 技术栈：react,react-router/-dom,webpack5,react-redux,immutable,axios,styled-components,antd

### 亮点

- 极速打包
- 尽我所能的缩小首屏加载时常(prod)
- 全自动的动态链接库
- 不同环境不同配置的 webpack
- 更快的配置路由
- 多环境多域名处理
- 在保证包大小的情况下进行浏览器兼容处理
- n 个 webpack 小优化 😎
- 集成 antd，并设置按需加载
- 集成 zzy-javascript-devtools(手动狗头～)
- 控制台更干净，友善的提示
- 运行，打包改用 node API 写法执行 更高的操作上限
- eslint 校验新增

## webpack5-react-mobile 以及 vue-self-admin 不做阐述，前者和上面的 v2 基本一致，只是没有 ts 和 css 区别，后者只是摘除一些多余内容。

[webpack5-react-mobile github 地址](https://github.com/Weibienaole/zProject_webpack_react_mobile)
[vue-self-admin github](https://github.com/Weibienaole/zProject_vue-self-admin)
