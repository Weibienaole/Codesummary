---
highlight: monokai
theme: github
---

_摘自 [深入浅出 Vite](https://juejin.cn/book/7050063811973218341/section)_

# 说明

- 模块联邦中主要有两种模块: `本地模块`和`远程模块`。
- 本地模块即为普通模块，是当前构建流程中的一部分，而远程模块不属于当前构建流程，在本地模块的运行时进行导入，同时本地模块和远程模块可以共享某些依赖的代码

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2303133caa824b3abb07917a971949f6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2166&h=1022&s=289238&e=png&b=ffffff)

- 在模块联邦中，每个模块既可以是`本地模块`，导入其它的`远程模块`，又可以作为远程模块，被其他的模块导入

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/898400584bb3444ba1c2d44567e38f70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2534&h=1504&s=479178&e=png&b=ffffff)

## 主要优势

1. **实现任意粒度的模块共享**。这里所指的模块粒度可大可小，包括第三方 npm 依赖、业务组件、工具函数，甚至可以是整个前端应用！而整个前端应用能够共享产物，代表着各个应用单独开发、测试、部署，这也是一种`微前端`的实现。
1. **优化构建产物体积**。远程模块可以从本地模块运行时被拉取，而不用参与本地模块的构建，可以加速构建过程，同时也能减小构建产物。
1. **运行时按需加载**。远程模块导入的粒度可以很小，如果你只想使用 app1 模块的`add`函数，只需要在 app1 的构建配置中导出这个函数，然后在本地模块中按照诸如`import('app1/add')`的方式导入即可，这样就很好地实现了模块按需加载。
1. **第三方依赖共享**。通过模块联邦中的共享依赖机制，我们可以很方便地实现在模块间公用依赖代码，从而避免以往的`external + CDN 引入`方案的各种问题。

# 使用

- vite 部分主要以`@originjs/vite-plugin-federation` 为准

```
yarn add @originjs/vite-plugin-federation -D
```

### 远端模块 remote 配置

```javascript
// remote/vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 模块联邦配置
    federation({
      name: "remote_app",
      filename: "remoteEntry.js",
      // 导出模块声明
      exposes: {
        "./Button": "./src/components/Button.js",
        "./App": "./src/App.vue",
        "./utils": "./src/utils.ts",
      },
      // 共享依赖声明
      shared: ["vue"],
    }),
  ],
  // 打包配置
  build: {
    target: "esnext",
  },
});
```

### 本地模块 host 配置

```javascript
// 本地模块配置
// host/vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      // 远程模块声明
      remotes: {
        remote_app: "http://localhost:3001/assets/remoteEntry.js",
      },
      // 共享依赖声明
      shared: ["vue"],
    }),
  ],
  build: {
    target: "esnext",
  },
});
```

随后对远端模块内容进行打包，并 预览，模拟 CDN 部署效果。

```
// 打包产物
pnpm run build
// 模拟部署效果，一般会在生产环境将产物上传到 CDN
npx vite preview --port=3001 --strictPort
```

便可在本地模块中进行使用

```javascript
<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";

import { defineAsyncComponent } from "vue";

// 导入远程模块
// 1. 组件
import RemoteApp from "remote_app/App";
// 2. 工具函数
import { add } from "remote_app/utils";
// 3. 异步组件
const AysncRemoteButton = defineAsyncComponent(
  () => import("remote_app/Button")
);
const data: number = add(1, 2);
</script>

<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld />
    <RemoteApp />
    <AysncRemoteButton />
    <p>应用 2 工具函数计算结果: 1 + 2 = {{ data }}</p>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

这样便可以在本地项目中使用远端的内容了。

总体的流程为：

1.  远程模块通过`exposes`  注册导出的模块，本地模块通过  `remotes`  注册远程模块地址。
2.  远程模块进行构建，并部署到云端。
3.  本地通过`import '远程模块名称/xxx'`的方式来引入远程模块，实现运行时加载。

且：

- 在模块联邦中的配置中，`exposes`  和`remotes`参数其实并不冲突，也就是说一个模块既可以作为本地模块，又可以作为远程模块。
- 由于 Vite 的插件机制与 Rollup 兼容，`vite-plugin-federation`方案在 Rollup 中也是完全可以使用的。

# 实现原理

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96758fe9dfd54ccf8287a63c1e49ad3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1832&h=1170&s=239938&e=png&b=fefefe)

- 对于共享依赖而言

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f707e825de44b45ab59a7cda7c1d376~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1540&h=660&s=118343&e=png&b=fffcfc)

- 流程图

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/187c6dfa584d45188043d1c4dfbcc63f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1880&h=1136&s=188889&e=png&b=fefefe)
