---
highlight: monokai
theme: github
---

[摘自：_深入浅出 Vite_](https://juejin.cn/book/7050063811973218341/section/7066613178028785700?utm_source=course_list)

# 大纲

**当前实现流程基于 Vite2x，最新版本实现有所改动。**

## 整体实现流程

1. 搭建项目脚本，有对简单脚本命令处理能力
2. 实现启动时`依赖预构建`功能，基于 Esbuild 实现依赖扫描以及构建
3. 实现 Vite 的`插件机制、容器`，也就是`PluginContainer`和`PluginContext`，模拟 Rollup 插件机制。
4. 在插件容器的基础上实现逐渐实现 No-Bundle 服务的编译能力，比如入口文件处理、tsx，ts，jsx 文件处理、css 预处理、静态资源处理
5. 最后实现一套的 HMR，可以进行简易的热更新

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a55fe7cb9974f23b1465457d4c09781~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1614&h=1392&s=474069&e=png&b=f7f7f7)

# 实现

## 初始化项目

`yarn init -y` 后，package.json 内内容包含如下：

```json
{
  "name": "m-vite",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "bin": {
    "mini-vite": "bin/mini-vite"
  },
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup --minify"
  },
  "devDependencies": {
    "@types/babel__core": "^7.1.19",
    "@types/connect": "^3.4.35",
    "@types/debug": "^4.1.7",
    "@types/fs-extra": "^9.0.13",
    "@types/resolve": "^1.20.2",
    "@types/ws": "^8.5.3",
    "tsup": "^5.12.6"
  },
  "dependencies": {
    "@babel/core": "^7.17.10",
    "cac": "^6.7.12",
    "chokidar": "^3.5.3",
    "connect": "^3.7.0",
    "debug": "^4.3.4",
    "es-module-lexer": "^0.10.5",
    "esbuild": "^0.14.38",
    "fs-extra": "^10.1.0",
    "magic-string": "^0.26.1",
    "picocolors": "^1.0.0",
    "react-refresh": "^0.13.0",
    "resolve": "^1.22.0",
    "rollup": "^2.70.2",
    "sirv": "^2.0.2",
    "ws": "^8.5.0"
  }
}
```

主要利用 tsup 进行代码的编译，在`tsup.config.json`中配置产出文件的格式(format)设置为：['esm', 'cjs']，使产出包含两种格式。

指向的入口文件中，通过`cac`插件生成可用命令，然后在`bin/mini-vite`中引入打包后的入口文件。

```js
#!/usr/bin/env node

require("../dist/index.js");
```

入口文件：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3961e722c13240c8876156539c33ae69~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=856&s=117395&e=png&b=282924)

在最终的执行中，需要先启动服务器，通过 `connect` 插件实现

```js
// connect 是一个具有中间件机制的轻量级 Node.js 框架。
// 既可以单独作为服务器，也可以接入到任何具有中间件机制的框架中，如 Koa、Express
import connect from "connect";
// picocolors 是一个用来在命令行显示不同颜色文本的工具
import { blue, green } from "picocolors";

export async function startDevServer() {
  const app = connect();
  const root = process.cwd();
  const startTime = Date.now();
  app.listen(3000, async () => {
    console.log(
      green("🚀 No-Bundle 服务已经成功启动!"),
      `耗时: ${Date.now() - startTime}ms`
    );
    console.log(`> 本地访问路径: ${blue("http://localhost:3000")}`);
  });
}
```

## 依赖预构建

依赖预构建函数(optimize)需要做三件事：

1. 确认入口
2. 从入口处扫描依赖
3. 预构建依赖

服务启动后同步执行 optimize

```js
// ...code
app.listen(3000, async () => {
  await optimize(root);
  // ...code
});
```

### 确认入口

```js
import path from "path";

// 1. 确定入口
const entry = path.resolve(root, "src/main.tsx");
```

### 扫描依赖

```ts
// 需要引入的依赖
import { build } from "esbuild";
import { green } from "picocolors";
import { scanPlugin } from "./scanPlugin";

// 2. 从入口处扫描依赖
const deps = new Set<string>();
await build({
  entryPoints: [entry],
  bundle: true,
  // 不写入磁盘，速度提升
  write: false,
  // 扫描逻辑通过插件开发
  plugins: [scanPlugin(deps)],
});
console.log(
  `${green("需要预构建的依赖")}:\n${[...deps]
    .map(green)
    .map((item) => `  ${item}`)
    .join("\n")}`
);
```

扫描依赖需要通过 Esbuild 完成，esanPlugin 插件内得到的依赖全部存储在`deps`中

```ts
// src/node/optimizer/scanPlugin.ts
import { Plugin } from "esbuild";
import { BARE_IMPORT_RE, EXTERNAL_TYPES } from "../constants";

export function scanPlugin(deps: Set<string>): Plugin {
  return {
    name: "esbuild:scan-deps",
    setup(build) {
      // 忽略的文件类型
      build.onResolve(
        { filter: new RegExp(`\\.(${EXTERNAL_TYPES.join("|")})$`) },
        (resolveInfo) => {
          return {
            path: resolveInfo.path,
            // 打上 external 标记
            external: true,
          };
        }
      );
      // 记录依赖
      build.onResolve(
        {
          filter: BARE_IMPORT_RE,
        },
        (resolveInfo) => {
          const { path: id } = resolveInfo;
          // 推入 deps 集合中
          deps.add(id);
          return {
            path: id,
            external: true,
          };
        }
      );
    },
  };
}
```

```ts
// src/node/constants.ts
export const EXTERNAL_TYPES = [
  "css",
  "less",
  "sass",
  "scss",
  "styl",
  "stylus",
  "pcss",
  "postcss",
  "vue",
  "svelte",
  "marko",
  "astro",
  "png",
  "jpe?g",
  "gif",
  "svg",
  "ico",
  "webp",
  "avif",
];

export const BARE_IMPORT_RE = /^[\w@][^:]/;
```

scanPlugin 插件主要做两件事：

1. 无关资源 external，避免 esbuild 处理
2. bare-import 资源(如 import React from 'react'这种的第三方包)加入父级的 deps 中。

### 预构建依赖

扫描完成之后就可以对依赖列表进行打包

```ts
// src/node/optimizer/index.ts
// 需要引入的依赖
import { preBundlePlugin } from "./preBundlePlugin";
import { PRE_BUNDLE_DIR } from "../constants";

// 3. 预构建依赖
await build({
  // 每一个依赖都是一个需要打包的入口
  entryPoints: [...deps],
  // 这次写入
  write: true,
  bundle: true,
  format: "esm",
  splitting: true,
  // 输出到 node_modules/.m-vite 中
  outdir: path.resolve(root, PRE_BUNDLE_DIR),
  plugins: [preBundlePlugin(deps)],
});
```

```ts
// src/node/constants.ts
// 增加如下代码
import path from "path";

// 预构建产物默认存放在 node_modules 中的 .m-vite 目录中
export const PRE_BUNDLE_DIR = path.join("node_modules", ".m-vite");
```

由于需要兼容 Windows 系统，所以需要添些功能函数，对路径进行处理

```ts
// src/node/utils.ts
import os from "os";

export function slash(p: string): string {
  return p.replace(/\\/g, "/");
}

export const isWindows = os.platform() === "win32";

// 路径处理
export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id);
}
```

`preBundlePlugin`插件主要对每一个依赖针对两种格式(esm/cjs)构造代理模块，如下：

```ts
import { Loader, Plugin } from "esbuild";
import { BARE_IMPORT_RE } from "../constants";
// 用来分析 es 模块 import/export 语句的库
import { init, parse } from "es-module-lexer";
import path from "path";
// 一个实现了 node 路径解析算法的库
import resolve from "resolve";
// 一个更加好用的文件操作库
import fs from "fs-extra";
import { normalizePath } from "../utils";

export function preBundlePlugin(deps: Set<string>): Plugin {
  return {
    name: "esbuild:pre-bundle",
    setup(build) {
      build.onResolve(
        {
          filter: BARE_IMPORT_RE,
        },
        (resolveInfo) => {
          const { path: id, importer } = resolveInfo;
          const isEntry = !importer;
          // 命中需要预编译的依赖
          if (deps.has(id)) {
            // 若为入口，则标记 dep 的 namespace
            return isEntry
              ? {
                  path: id,
                  namespace: "dep",
                }
              : {
                  // 因为走到 onResolve 了，所以这里的 path 就是绝对路径了
                  path: resolve.sync(id, { basedir: process.cwd() }),
                };
          }
        }
      );

      // 拿到标记后的依赖，构造代理模块，交给 esbuild 打包
      build.onLoad(
        {
          filter: /.*/,
          namespace: "dep",
        },
        async (loadInfo) => {
          await init;
          const id = loadInfo.path;
          const root = process.cwd();
          const entryPath = normalizePath(resolve.sync(id, { basedir: root }));
          const code = await fs.readFile(entryPath, "utf-8");
          // 解析当前代码，获取到所有的import，export
          const [imports, exports] = await parse(code);
          let proxyModule = [];
          // cjs
          if (!imports.length && !exports.length) {
            // 构造代理模块
            // 通过 require 拿到模块的导出对象
            const res = require(entryPath);
            // 用 Object.keys 拿到所有的具名导出
            const specifiers = Object.keys(res);
            // 构造 export 语句交给 Esbuild 打包
            proxyModule.push(
              `export { ${specifiers.join(",")} } from "${entryPath}"`,
              `export default require("${entryPath}")`
            );
          } else {
            // esm 格式比较好处理，export * 或者 export default 即可
            if (exports.includes("default")) {
              proxyModule.push(`import d from "${entryPath}";export default d`);
            }
            proxyModule.push(`export * from "${entryPath}"`);
          }
          const loader = path.extname(entryPath).slice(1);
          return {
            loader: loader as Loader,
            contents: proxyModule.join("\n"),
            resolveDir: root,
          };
        }
      );
    },
  };
}
```

对于 cjs 格式的依赖，单纯只处理默认导出的话，是有问题的，需要将所有的子导出再依次 export，保证不会丢失子导出。

```ts
// 预构建产物导出代码
export {
  react_default as default,
  useState,
  useEffect,
  // 省略其它导出
};
```

打包后产出的内容就是这样的

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/695dace3cd2442cd8f60d0472fc03f77~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=422&h=358&s=32752&e=png&b=1f201d)

## 实现插件机制，插件容器

### 声明插件类型

首先需要声明插件的类型：

```ts
import { LoadResult, PartialResolvedId, SourceDescription } from "rollup";
import { ServerContext } from "./server";

export type ServerHook = (
  server: ServerContext
) => (() => void) | void | Promise<(() => void) | void>;

export interface Plugin {
  name: string;
  configureServer?: ServerHook;
  resolveId?: (
    id: string,
    importer?: string
  ) => Promise<PartialResolvedId | null> | PartialResolvedId | null;
  load?: (id: string) => Promise<LoadResult | null> | LoadResult | null;
  transform?: (
    code: string,
    id: string
  ) => Promise<SourceDescription | null> | SourceDescription | null;
  transformIndexHtml?: (raw: string) => Promise<string> | string;
}
```

### 插件容器实现

```ts
import type {
  LoadResult,
  PartialResolvedId,
  SourceDescription,
  PluginContext as RollupPluginContext,
  ResolvedId,
} from "rollup";
import { Plugin } from "./plugin";

export interface PluginContainer {
  resolveId(id: string, importer?: string): Promise<PartialResolvedId | null>;
  load(id: string): Promise<LoadResult | null>;
  transform(code: string, id: string): Promise<SourceDescription | null>;
}

// rollup插件机制实现
export const createPluginContainer = (plugins: Plugin[]): PluginContainer => {
  // @ts-ignore 这里仅实现上下文对象的 resolve 方法
  class Context implements RollupPluginContext {
    async resolve(id: string, importer?: string) {
      let out = await pluginContainer.resolveId(id, importer);
      if (typeof out === "string") out = { id: out };
      return out as ResolvedId | null;
    }
  }

  const pluginContainer: PluginContainer = {
    async resolveId(id: string, importer?: string) {
      const ctx = new Context() as any;
      for (const plugin of plugins) {
        if (plugin.resolveId) {
          const newId = await plugin.resolveId.call(ctx as any, id, importer);
          if (newId) {
            id = typeof newId === "string" ? newId : newId.id;
            return { id };
          }
        }
      }
      return null;
    },
    async load(id: string) {
      const ctx = new Context() as any;
      for (const plugin of plugins) {
        if (plugin.load) {
          const result = await plugin.load.call(ctx, id);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
    async transform(code: string, id: string) {
      const ctx = new Context() as any;
      for (const plugin of plugins) {
        if (plugin.transform) {
          const result = await plugin.transform.call(ctx, code, id);
          if (!result) continue;
          if (typeof result === "string") {
            code = result;
          } else if (result.code) {
            code = result.code;
          }
        }
      }
      return { code };
    },
  };

  return pluginContainer;
};
```

这个实现方式说白了就是模拟 vite 中的模拟 rollup 的插件机制实现，基本一致，如果不明白的话需要先去了解 rollup 内的生命周期以及实现方式。

插件中间件`PluginContext`在后面实现。

### 接入插件容器

在服务器启动前，需要将插件容器初始化以及依次调用被引入的插件。

```ts
// src/node/server/index.ts
import connect from "connect";
import { blue, green } from "picocolors";
import { optimize } from "../optimizer/index";

// add
import { resolvePlugins } from "../plugins";
import { createPluginContainer, PluginContainer } from "../pluginContainer";
// end

// add
export interface ServerContext {
  root: string;
  pluginContainer: PluginContainer;
  app: connect.Server;
  plugins: Plugin[];
}
// end

export async function startDevServer() {
  const app = connect();
  const root = process.cwd();
  const startTime = Date.now();
  // add
  // resolvePlugins函数是被引入的插件组
  const plugins = resolvePlugins();

  // 这里在创建插件容器后依次在 configureServer 钩子中传入当前 服务器中间件，这样就可以在每一个插件中使用这个 Context
  const pluginContainer = createPluginContainer(plugins);

  const serverContext: ServerContext = {
    root: process.cwd(),
    app,
    pluginContainer,
    plugins,
  };

  for (const plugin of plugins) {
    if (plugin.configureServer) {
      await plugin.configureServer(serverContext);
    }
  }
  // end

  app.listen(3000, async () => {
    await optimize(root);
    console.log(
      green("🚀 No-Bundle 服务已经成功启动!"),
      `耗时: ${Date.now() - startTime}ms`
    );
    console.log(`> 本地访问路径: ${blue("http://localhost:3000")}`);
  });
}
```

```ts
import { Plugin } from "../plugin";

export function resolvePlugins(): Plugin[] {
  // 插件组
  return [];
}
```

## 核心编译插件实现

### 入口 HTML 处理

核心通过服务器中间件引入，配合插件内的钩子实现

```ts
// src/node/server/middlewares/indexHtml.ts
import { NextHandleFunction } from "connect";
import { ServerContext } from "../index";
import path from "path";
import { pathExists, readFile } from "fs-extra";

export function indexHtmlMiddware(
  serverContext: ServerContext
): NextHandleFunction {
  return async (req, res, next) => {
    if (req.url === "/") {
      const { root } = serverContext;
      // 默认使用项目根目录下的 index.html
      const indexHtmlPath = path.join(root, "index.html");
      if (await pathExists(indexHtmlPath)) {
        const rawHtml = await readFile(indexHtmlPath, "utf8");
        let html = rawHtml;
        // 通过执行插件的 transformIndexHtml 钩子来对 HTML 进行自定义的修改
        for (const plugin of serverContext.plugins) {
          if (plugin.transformIndexHtml) {
            html = await plugin.transformIndexHtml(html);
          }
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        return res.end(html);
      }
    }
    return next();
  };
}
```

```ts
// src/node/server/index.ts
// 需要增加的引入语句
import { indexHtmlMiddware } from "./middlewares/indexHtml";

// 省略中间的代码

// 处理入口 HTML 资源
app.use(indexHtmlMiddware(serverContext));

app.listen(3000, async () => {
  // 省略
});
```

### JS/TS/JSX/TSX 编译能力

```ts
// src/node/server/middlewares/transform.ts
import { NextHandleFunction } from "connect";
import { isJSRequest, cleanUrl } from "../../utils";
import { ServerContext } from "../index";

export async function transformRequest(
  url: string,
  serverContext: ServerContext
) {
  const { pluginContainer } = serverContext;
  url = cleanUrl(url);
  // 简单来说，就是依次调用插件容器的 resolveId、load、transform 方法，交给插件处理。
  const resolvedResult = await pluginContainer.resolveId(url);
  let transformResult;
  if (resolvedResult?.id) {
    let code = await pluginContainer.load(resolvedResult.id);
    if (typeof code === "object" && code !== null) {
      code = code.code;
    }
    if (code) {
      transformResult = await pluginContainer.transform(
        code as string,
        resolvedResult?.id
      );
    }
  }
  return transformResult;
}

export function transformMiddleware(
  serverContext: ServerContext
): NextHandleFunction {
  return async (req, res, next) => {
    if (req.method !== "GET" || !req.url) {
      return next();
    }
    const url = req.url;
    // transform JS request
    if (isJSRequest(url)) {
      // 核心编译函数
      let result = await transformRequest(url, serverContext);
      if (!result) {
        return next();
      }
      if (result && typeof result !== "string") {
        result = result.code;
      }
      // 编译完成，返回响应给浏览器
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/javascript");
      return res.end(result);
    }

    next();
  };
}
```

使用方式同上，通过`app.use`注册。

通过这个中间件，就可以将 js 请求内的内容，移交给插件机制处理。主要处理能力依据插件实现。

补充上文的常量以及定义

```ts
// src/node/utils.ts
import { JS_TYPES_RE } from "./constants.ts";

export const isJSRequest = (id: string): boolean => {
  id = cleanUrl(id);
  if (JS_TYPES_RE.test(id)) {
    return true;
  }
  if (!path.extname(id) && !id.endsWith("/")) {
    return true;
  }
  return false;
};

export const cleanUrl = (url: string): string =>
  url.replace(HASH_RE, "").replace(QEURY_RE, "");

// src/node/constants.ts
export const JS_TYPES_RE = /\.(?:j|t)sx?$|\.mjs$/;
export const QEURY_RE = /\?.*$/s;
export const HASH_RE = /#.*$/s;
```

### 路径解析插件：resolvePlugin

**将 js 请求中的路径转换为真实地址指向的文件**

```ts
import resolve from "resolve";
import { Plugin } from "../plugin";
import { ServerContext } from "../server/index";
import path from "path";
import { pathExists } from "fs-extra";
import { DEFAULT_EXTERSIONS } from "../constants";
import { cleanUrl, normalizePath } from "../utils";

export function resolvePlugin(): Plugin {
  let serverContext: ServerContext;
  return {
    name: "m-vite:resolve",
    configureServer(s) {
      // 保存服务端上下文
      serverContext = s;
    },
    async resolveId(id: string, importer?: string) {
      // 1. 绝对路径
      if (path.isAbsolute(id)) {
        if (await pathExists(id)) {
          return { id };
        }
        // 加上 root 路径前缀，处理 /src/main.tsx 的情况
        id = path.join(serverContext.root, id);
        if (await pathExists(id)) {
          return { id };
        }
      }
      // 2. 相对路径
      else if (id.startsWith(".")) {
        if (!importer) {
          throw new Error("`importer` should not be undefined");
        }
        const hasExtension = path.extname(id).length > 1;
        let resolvedId: string;
        // 2.1 包含文件名后缀
        // 如 ./App.tsx
        if (hasExtension) {
          resolvedId = normalizePath(
            resolve.sync(id, { basedir: path.dirname(importer) })
          );
          if (await pathExists(resolvedId)) {
            return { id: resolvedId };
          }
        }
        // 2.2 不包含文件名后缀
        // 如 ./App
        else {
          // ./App -> ./App.tsx
          for (const extname of DEFAULT_EXTERSIONS) {
            try {
              const withExtension = `${id}${extname}`;
              resolvedId = normalizePath(
                resolve.sync(withExtension, {
                  basedir: path.dirname(importer),
                })
              );
              if (await pathExists(resolvedId)) {
                return { id: resolvedId };
              }
            } catch (e) {
              continue;
            }
          }
        }
      }
      return null;
    },
  };
}

// src/node/constants.ts
export const DEFAULT_EXTERSIONS = [".tsx", ".ts", ".jsx", "js"];
```

这样对于  `/src/main.tsx`，在插件中会转换为文件系统中的真实路径，从而让模块在 load 钩子中能够正常加载

### Esbuild 语法编译 esbuildTrasnform

```ts
import { readFile } from "fs-extra";
import { Plugin } from "../plugin";
import { isJSRequest } from "../utils";
import esbuild from "esbuild";
import path from "path";

export function esbuildTransformPlugin(): Plugin {
  return {
    name: "m-vite:esbuild-transform",
    // 加载模块
    async load(id) {
      if (isJSRequest(id)) {
        try {
          const code = await readFile(id, "utf-8");
          return code;
        } catch (e) {
          return null;
        }
      }
    },
    async transform(code, id) {
      if (isJSRequest(id)) {
        const extname = path.extname(id).slice(1);
        // 利用esbuild.transform能力进行相对应的转换
        const { code: transformedCode, map } = await esbuild.transform(code, {
          target: "esnext",
          format: "esm",
          sourcemap: true,
          loader: extname as "js" | "ts" | "jsx" | "tsx",
        });
        return {
          code: transformedCode,
          map,
        };
      }
      return null;
    },
  };
}
```

### import 语法解析：importAnalysis

对于包引入需要对其进行路径的转换

```ts
// 新建 src/node/plugins/importAnalysis.ts
import { init, parse } from "es-module-lexer";
import {
  BARE_IMPORT_RE,
  DEFAULT_EXTERSIONS,
  // 预构建包所在位置
  PRE_BUNDLE_DIR,
} from "../constants";
import { cleanUrl, isJSRequest, normalizePath } from "../utils";
// magic-string 用来作字符串编辑
import MagicString from "magic-string";
import path from "path";
import { Plugin } from "../plugin";
import { ServerContext } from "../server/index";
import { pathExists } from "fs-extra";
import resolve from "resolve";

export function importAnalysisPlugin(): Plugin {
  let serverContext: ServerContext;
  return {
    name: "m-vite:import-analysis",
    configureServer(s) {
      // 保存服务端上下文
      serverContext = s;
    },
    async transform(code: string, id: string) {
      // 只处理 JS 相关的请求
      if (!isJSRequest(id)) {
        return null;
      }
      await init;
      // 解析 import 语句
      const [imports] = parse(code);
      const ms = new MagicString(code);
      // 对每一个 import 语句依次进行分析
      for (const importInfo of imports) {
        // 举例说明: const str = `import React from 'react'`
        // str.slice(s, e) => 'react'
        const { s: modStart, e: modEnd, n: modSource } = importInfo;
        if (!modSource) continue;
        // 第三方库: 路径重写到预构建产物的路径
        if (BARE_IMPORT_RE.test(modSource)) {
          const bundlePath = normalizePath(
            path.join("/", PRE_BUNDLE_DIR, `${modSource}.js`)
          );
          // 重写
          ms.overwrite(modStart, modEnd, bundlePath);
        } else if (modSource.startsWith(".") || modSource.startsWith("/")) {
          // 直接调用插件上下文的 resolve 方法，会自动经过路径解析插件的处理 -> pluginContainer-Context内实现
          const resolved = await this.resolve(modSource, id);
          if (resolved) {
            ms.overwrite(modStart, modEnd, resolved.id);
          }
        }
      }

      return {
        code: ms.toString(),
        // 生成 SourceMap
        map: ms.generateMap(),
      };
    },
  };
}
```

插件注册是在 resolvePlugin 依次引入即可

```ts
// src/node/plugin/index.ts
import { esbuildTransformPlugin } from "./esbuild";
import { importAnalysisPlugin } from "./importAnalysis";
import { resolvePlugin } from "./resolve";
import { Plugin } from "../plugin";

export function resolvePlugins(): Plugin[] {
  return [resolvePlugin(), esbuildTransformPlugin(), importAnalysisPlugin()];
}
```

### css 编译：cssPlugin

css 正常加载的话，首先需要在 trasnform 中间件中，添加 css 请求的处理：

```ts
// src/node/server/middlewares/transform.ts
// 需要增加的导入语句
import { isCSSRequest } from '../../utils';

export function transformMiddleware(
  serverContext: ServerContext
): NextHandleFunction {
  return async (req, res, next) => {
    // ...code
    // 这里将
    if (isJSRequest(url)) {
    // 改为
    if (isJSRequest(url) || isCSSRequest(url))
      // 后续代码省略
     }
    next();
  };
}

// 工具函数补充
// src/node/utils.ts
export const isCSSRequest = (id: string): boolean =>
  cleanUrl(id).endsWith(".css");
```

css 插件：

```ts
import { readFile } from "fs-extra";
import { Plugin } from "../plugin";

export function cssPlugin(): Plugin {
  return {
    name: "m-vite:css",
    load(id) {
      if (id.endsWith(".css")) {
        return readFile(id, "utf-8");
      }
    },
    async transform(code, id) {
      if (id.endsWith(".css")) {
        // 包装成 JS 模块
        const jsContent = `
const css = "${code.replace(/\n/g, "")}";
const style = document.createElement("style");
style.setAttribute("type", "text/css");
style.innerHTML = css;
document.head.appendChild(style);
export default css;
`.trim();
        return {
          code: jsContent,
        };
      }
      return null;
    },
  };
}
```

在 resolvePlugin 中注册就完成了。

### 静态资源加载 assetsPlugin

静态资源加载有两种情况

- import 请求，比如 `import logo from './assets/logo.svg'`
- 资源内容请求，比如 img.src 中的内容，他通过浏览器去相应内内容

#### import 请求

1. 首先要对 import 的 svg 地址做一个标记

```ts
// src/node/plugins/importAnalysis.ts
async transform(code, id) {
  // 省略前面的代码
  for (const importInfo of imports) {
    const { s: modStart, e: modEnd, n: modSource } = importInfo;
    if (!modSource) continue;
    // add
    // 静态资源
    if (modSource.endsWith(".svg")) {
      // 加上 ?import 后缀
      const resolvedUrl = path.join(path.dirname(id), modSource);
      ms.overwrite(modStart, modEnd, `${resolvedUrl}?import`);
      continue;
    }
    // end
  }
}
```

2. 浏览器发出带有?import 后缀的请求后，对请求进行拦截

```ts
// src/node/server/middlewares/transform.ts
// 需要增加的导入语句
import { isCSSRequest } from '../../utils';

export function transformMiddleware(
  serverContext: ServerContext
): NextHandleFunction {
  return async (req, res, next) => {
    // ...code
    // 这里将
    if (isJSRequest(url) || isCSSRequest(url)) {
    // 改为
    if (isJSRequest(url) || isCSSRequest(url) || isImportRequest(url)) {
      // 后续代码省略
    }
    next();
  };
}

// 工具函数补充
// src/node/utils.ts
export function isImportRequest(url: string): boolean {
  return url.endsWith("?import");
}
```

3. 拦截后就可以在插件中处理

```ts
import { pathExists, readFile } from "fs-extra";
import { Plugin } from "../plugin";
import { ServerContext } from "../server";
import {
  cleanUrl,
  getShortName,
  normalizePath,
  removeImportQuery,
} from "../utils";

export function assetPlugin(): Plugin {
  let serverContext: ServerContext;

  return {
    name: "m-vite:asset",
    configureServer(s) {
      serverContext = s;
    },
    async load(id) {
      const cleanedId = removeImportQuery(cleanUrl(id));
      const resolvedId = `/${getShortName(
        normalizePath(id),
        serverContext.root
      )}`;

      // 这里仅处理 svg
      if (cleanedId.endsWith(".svg")) {
        return {
          code: `export default "${resolvedId}"`,
        };
      }
    },
  };
}
```

随后在 resolvePlugins 函数中注册即可

#### 资源类型请求

这类型请求需要新建一个中间件，在其中处理逻辑：

```ts
// src/node/server/middlewares/static.ts
import { NextHandleFunction } from "connect";
import { isImportRequest } from "../../utils";
// 一个用于加载静态资源的中间件
import sirv from "sirv";

export function staticMiddleware(root: string): NextHandleFunction {
  const serveFromRoot = sirv(root, { dev: true });
  return async (req, res, next) => {
    if (!req.url) {
      return;
    }
    // 不处理 import 请求
    if (isImportRequest(req.url)) {
      return;
    }
    // 直接交由sirv去处理
    serveFromRoot(req, res, next);
  };
}
```

随后在 app.use 中注册这个中间件即可

```ts
// src/node/server/index.ts
// 需要添加的引入语句
import { staticMiddleware } from "./middlewares/static";

export async function startDevServer() {
  // 前面的代码省略
  app.use(staticMiddleware(serverContext.root));

  app.listen(3000, async () => {
    // 省略实现
  });
}
```

这里只针对.svg 格式的静态文件做处理，但大部分都可以通过类似的逻辑去实现。

## HMR 机制实现

### 模块依赖图（ModuleGraph 类）

实现 hmr 之前，需要先实现`模块依赖图`这个能力，用于记录各个模块之间的依赖关系，同时可以存储各个模块的信息，用于编译缓存。

```ts
// src/node/ModuleGraph.ts
import { PartialResolvedId, TransformResult } from "rollup";
import { cleanUrl } from "./utils";

export class ModuleNode {
  // 资源访问 url
  url: string;
  // 资源绝对路径
  id: string | null = null;
  // 引入的依赖表
  importers = new Set<ModuleNode>();
  // 引入的依赖模块表(code)
  importedModules = new Set<ModuleNode>();
  // 缓存内容
  transformResult: TransformResult | null = null;
  // 上一次hmr的时间戳
  lastHMRTimestamp = 0;
  constructor(url: string) {
    this.url = url;
  }
}

export class ModuleGraph {
  // 资源 url 到 ModuleNode 的映射表
  urlToModuleMap = new Map<string, ModuleNode>();
  // 资源绝对路径到 ModuleNode 的映射表
  idToModuleMap = new Map<string, ModuleNode>();

  constructor(
    private resolveId: (url: string) => Promise<PartialResolvedId | null>
  ) {}

  getModuleById(id: string): ModuleNode | undefined {
    return this.idToModuleMap.get(id);
  }

  async getModuleByUrl(rawUrl: string): Promise<ModuleNode | undefined> {
    const { url } = await this._resolve(rawUrl);
    return this.urlToModuleMap.get(url);
  }

  // 注册入口
  async ensureEntryFromUrl(rawUrl: string): Promise<ModuleNode> {
    const { url, resolvedId } = await this._resolve(rawUrl);
    // 首先检查缓存
    if (this.urlToModuleMap.has(url)) {
      return this.urlToModuleMap.get(url) as ModuleNode;
    }
    // 若无缓存，更新 urlToModuleMap 和 idToModuleMap
    const mod = new ModuleNode(url);
    mod.id = resolvedId;
    this.urlToModuleMap.set(url, mod);
    this.idToModuleMap.set(resolvedId, mod);
    return mod;
  }

  // 模块更新
  async updateModuleInfo(
    mod: ModuleNode,
    importedModules: Set<string | ModuleNode>
  ) {
    const prevImports = mod.importedModules;
    for (const curImports of importedModules) {
      // 对每一个未注册的依赖进行注册，并返回内容
      const dep =
        typeof curImports === "string"
          ? await this.ensureEntryFromUrl(cleanUrl(curImports))
          : curImports;
      if (dep) {
        mod.importedModules.add(dep);
        dep.importers.add(mod);
      }
    }
    // 清除已经不再被引用的依赖
    for (const prevImport of prevImports) {
      if (!importedModules.has(prevImport.url)) {
        prevImport.importers.delete(mod);
      }
    }
  }

  // HMR 触发时会执行这个方法
  invalidateModule(file: string) {
    const mod = this.idToModuleMap.get(file);
    if (mod) {
      // 更新时间戳
      mod.lastHMRTimestamp = Date.now();
      mod.transformResult = null;
      mod.importers.forEach((importer) => {
        this.invalidateModule(importer.id!);
      });
    }
  }

  private async _resolve(
    url: string
  ): Promise<{ url: string; resolvedId: string }> {
    const resolved = await this.resolveId(url);
    const resolvedId = resolved?.id || url;
    return { url, resolvedId };
  }
}
```

将`ModuleGraph`实例初始化,并加入到 ServerContext 中

```ts
// src/node/server/index.ts
// add
import { ModuleGraph } from "../ModuleGraph";
// end

export interface ServerContext {
  root: string;
  pluginContainer: PluginContainer;
  app: connect.Server;
  plugins: Plugin[];
  // add
  moduleGraph: ModuleGraph;
  // end
}

export async function startDevServer() {
  // add
  const moduleGraph = new ModuleGraph((url) => pluginContainer.resolveId(url));
  // end

  const pluginContainer = createPluginContainer(plugins);
  const serverContext: ServerContext = {
    root: process.cwd(),
    app,
    pluginContainer,
    plugins,
    // add
    moduleGraph,
    // end
  };
}
```

在加载完模块，也就是 load 钩子过程中，需要将当前模块注册：

```ts
// src/node/server/middlewares/transform.ts
let code = await pluginContainer.load(resolvedResult.id);
if (typeof code === "object" && code !== null) {
  code = code.code;
}
// add
const { moduleGraph } = serverContext;
// 注册当前load的模块
mod = await moduleGraph.ensureEntryFromUrl(url);
// end
```

在分析完 import 语句后，也就是 importAnalysis 插件中，需要更新模块的依赖关系：

```ts
// src/node/plugins/importAnalysis.ts
export function importAnalysis() {
  return {
    transform(code: string, id: string) {
      // 省略前面的代码
      // add
      const { moduleGraph } = serverContext;
      const curMod = moduleGraph.getModuleById(id)!;
      // end
      const importedModules = new Set<string>();
      for (const importInfo of imports) {
        // 省略部分代码
        if (BARE_IMPORT_RE.test(modSource)) {
          // 省略部分代码
          // add
          importedModules.add(bundlePath);
          // end
        } else if (modSource.startsWith(".") || modSource.startsWith("/")) {
          const resolved = await resolve(modSource, id);
          if (resolved) {
            ms.overwrite(modStart, modEnd, resolved);
            // add
            importedModules.add(resolved);
            // end
          }
        }
      }
      // add
      // 将收集完的依赖整体update
      moduleGraph.updateModuleInfo(curMod, importedModules);
      // end
      // 省略后续 return 代码
    },
  };
}
```

最后在 trasnform 中间件中记录模块编译后的产物，并计入缓存

```ts
export async function transformRequest(
  url: string,
  serverContext: ServerContext
) {
  const { moduleGraph, pluginContainer } = serverContext;
  url = cleanUrl(url);
  // add
  let mod = await moduleGraph.getModuleByUrl(url);
  if (mod && mod.transformResult) {
    return mod.transformResult;
  }
  // end
  const resolvedResult = await pluginContainer.resolveId(url);
  let transformResult;
  if (resolvedResult?.id) {
    let code = await pluginContainer.load(resolvedResult.id);
    if (typeof code === "object" && code !== null) {
      code = code.code;
    }
    mod = await moduleGraph.ensureEntryFromUrl(url);
    if (code) {
      transformResult = await pluginContainer.transform(
        code as string,
        resolvedResult?.id
      );
    }
  }
  // add
  if (mod) {
    mod.transformResult = transformResult;
  }
  // end
  return transformResult;
}
```

### HMR 服务端

服务端需要做：

1. 创建文件监听器，监听文件改动
2. 创建 WebSocket 服务端，负责和客户端通信
3. 文件变动后，从 ModuleGraph 中定位到变动的模块，并通知客户端

#### 创建文件监听器

```ts
// src/node/server/index.ts
import chokidar, { FSWatcher } from "chokidar";

export async function startDevServer() {
  const watcher = chokidar.watch(root, {
    ignored: ["**/node_modules/**", "**/.git/**"],
    ignoreInitial: true,
  });
}
```

#### 创建 WebSocket 服务端

```ts
// src/node/ws.ts
import connect from "connect";
import { red } from "picocolors";
import { WebSocketServer, WebSocket } from "ws";
import { HMR_PORT } from "./constants";

export function createWebSocketServer(server: connect.Server): {
  send: (msg: string) => void;
  close: () => void;
} {
  let wss: WebSocketServer;
  wss = new WebSocketServer({ port: HMR_PORT });
  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "connected" }));
  });

  wss.on("error", (e: Error & { code: string }) => {
    if (e.code !== "EADDRINUSE") {
      console.error(red(`WebSocket server error:\n${e.stack || e.message}`));
    }
  });

  // 对外暴露两个方法，分别是发送行为，以及关闭
  return {
    send(payload: Object) {
      const stringified = JSON.stringify(payload);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(stringified);
        }
      });
    },

    close() {
      wss.close();
    },
  };
}

// 新增常量
// src/node/constants.ts
export const HMR_PORT = 13567;
```

然后将 WebSocket 加入到服务端中：

```ts
// src/node/server/index.ts
export interface ServerContext {
  root: string;
  pluginContainer: PluginContainer;
  app: connect.Server;
  plugins: Plugin[];
  moduleGraph: ModuleGraph;
  // add
  ws: { send: (data: any) => void; close: () => void };
  watcher: FSWatcher;
  // end
}

export async function startDevServer() {
  // add
  // WebSocket 对象
  const ws = createWebSocketServer(app);
  // end
  // // 开发服务器上下文
  const serverContext: ServerContext = {
    root: process.cwd(),
    app,
    pluginContainer,
    plugins,
    moduleGraph,
    // add
    ws,
    watcher,
    // end
  };
}
```

#### 文件变动后的处理逻辑

```ts
// src/node/hmr.ts
import { ServerContext } from "./server/index";
import { blue, green } from "picocolors";
import { getShortName } from "./utils";

export function bindingHMREvents(serverContext: ServerContext) {
  const { watcher, ws, root } = serverContext;

  watcher.on("change", async (file) => {
    console.log(`✨${blue("[hmr]")} ${green(file)} changed`);
    const { moduleGraph } = serverContext;
    // 清除模块依赖图中的缓存
    await moduleGraph.invalidateModule(file);
    // 向客户端发送更新信息
    ws.send({
      type: "update",
      updates: [
        {
          type: "js-update",
          timestamp: Date.now(),
          path: "/" + getShortName(file, root),
          acceptedPath: "/" + getShortName(file, root),
        },
      ],
    });
  });
}

// 工具函数补充
// src/node/utils.ts
export function getShortName(file: string, root: string) {
  return file.startsWith(root + "/") ? path.posix.relative(root, file) : file;
}
```

之后 在服务端中启用：

```ts
// src/node/server/index.ts
// add
import { bindingHMREvents } from "../hmr";
import { normalizePath } from "../utils";
// end

// 开发服务器上下文
const serverContext: ServerContext = {
  root: normalizePath(process.cwd()),
  app,
  pluginContainer,
  plugins,
  moduleGraph,
  ws,
  watcher,
};
// add
bindingHMREvents(serverContext);
// end
```

### HMR 客户端

客户端是指我们在模块中会注入一段脚本，主要做：

1. 创建 WebSocket 客户端，与服务端通信
2. 收到更新后，通过动态 import 拉取内容，随后调用 accept 回调
3. 暴露 HMR 工具函数，如 import.meta.hot.accept 实现

#### 创建客户端

客户端需要打包出去，所以在 tsup.config.ts 中需要新增入口：

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/node/cli.ts",
    // add
    client: "src/client/client.ts",
    // end
  },
});
```

脚本实现如下：

```ts
// src/client/client.ts
interface Update {
  type: "js-update" | "css-update";
  path: string;
  acceptedPath: string;
  timestamp: number;
}
console.log("[vite] connecting...");

// 1. 创建客户端 WebSocket 实例
// 其中的 __HMR_PORT__ 之后会被 no-bundle 服务编译成具体的端口号
const socket = new WebSocket(`ws://localhost:__HMR_PORT__`, "vite-hmr");

// 2. 接收服务端的更新信息
socket.addEventListener("message", async ({ data }) => {
  handleMessage(JSON.parse(data)).catch(console.error);
});

// 3. 根据不同的更新类型进行更新
async function handleMessage(payload: any) {
  switch (payload.type) {
    case "connected":
      console.log(`[vite] connected.`);
      // 心跳检测
      setInterval(() => socket.send("ping"), 1000);
      break;

    case "update":
      // 进行具体的模块更新
      payload.updates.forEach((update: Update) => {
        if (update.type === "js-update") {
          // 具体的更新逻辑，后续来开发
        }
      });
      break;
  }
}
```

首先先尝试将简单的 HMR 客户端内容注入到浏览器中：

```ts
// src/node/plugins/clientInject.ts
import { CLIENT_PUBLIC_PATH, HMR_PORT } from "../constants";
import { Plugin } from "../plugin";
import fs from "fs-extra";
import path from "path";
import { ServerContext } from "../server/index";

export function clientInjectPlugin(): Plugin {
  let serverContext: ServerContext;
  return {
    name: "m-vite:client-inject",
    configureServer(s) {
      serverContext = s;
    },
    resolveId(id) {
      if (id === CLIENT_PUBLIC_PATH) {
        return { id };
      }
      return null;
    },
    async load(id) {
      // 加载 HMR 客户端脚本
      if (id === CLIENT_PUBLIC_PATH) {
        const realPath = path.join(
          serverContext.root,
          "node_modules",
          "mini-vite",
          "dist",
          "client.mjs"
        );
        // 得到客户端真实地址
        const code = await fs.readFile(realPath, "utf-8");
        return {
          // 替换占位符
          code: code.replace("__HMR_PORT__", JSON.stringify(HMR_PORT)),
        };
      }
    },
    transformIndexHtml(raw) {
      // 插入客户端脚本
      // 即在 head 标签后面加上 <script type="module" src="/@vite/client"></script>
      // 注: 在 indexHtml 中间件里面会自动执行 transformIndexHtml 钩子
      return raw.replace(
        /(<head[^>]*>)/i,
        `$1<script type="module" src="${CLIENT_PUBLIC_PATH}"></script>`
      );
    },
  };
}

// 对应常量声明
// src/node/constants.ts
export const CLIENT_PUBLIC_PATH = "/@vite/client";
```

随后在 resolvePlugin 中注册即可，这个插件需要放置在最前方，确保不会被其他插件的 load 钩子所影响

然后再处理 插入客户端代码 的逻辑，需要在 importAnalysis 插件中处理：

```ts
import { init, parse } from "es-module-lexer";
import {
  BARE_IMPORT_RE,
  CLIENT_PUBLIC_PATH,
  PRE_BUNDLE_DIR,
} from "../constants";
import {
  cleanUrl,
  // add
  getShortName,
  // end
  isJSRequest,
} from "../utils";
import MagicString from "magic-string";
import path from "path";
import { Plugin } from "../plugin";
import { ServerContext } from "../server/index";

export function importAnalysisPlugin(): Plugin {
  let serverContext: ServerContext;
  return {
    name: "m-vite:import-analysis",
    configureServer(s) {
      serverContext = s;
    },
    async transform(code: string, id: string) {
      // change add isInternalRequest fn
      if (!isJSRequest(id) || isInternalRequest(id)) {
        // end
        return null;
      }
      await init;
      const importedModules = new Set<string>();
      const [imports] = parse(code);
      const ms = new MagicString(code);
      // add
      // 根据当前需求，重写resolve逻辑
      const resolve = async (id: string, importer?: string) => {
        const resolved = await this.resolve(id, normalizePath(importer));
        if (!resolved) {
          return;
        }
        const cleanedId = cleanUrl(resolved.id);
        const mod = moduleGraph.getModuleById(cleanedId);
        let resolvedId = `/${getShortName(resolved.id, serverContext.root)}`;
        if (mod && mod.lastHMRTimestamp > 0) {
          resolvedId += "?t=" + mod.lastHMRTimestamp;
        }
        return resolvedId;
      };
      // end
      const { moduleGraph } = serverContext;
      const curMod = moduleGraph.getModuleById(id)!;

      for (const importInfo of imports) {
        const { s: modStart, e: modEnd, n: modSource } = importInfo;
        if (!modSource || isInternalRequest(modSource)) continue;
        // 静态资源
        if (modSource.endsWith(".svg")) {
          // 加上 ?import 后缀
          // change
          const resolvedUrl = await resolve(modSource, id);
          // end
          ms.overwrite(modStart, modEnd, `${resolvedUrl}?import`);
          continue;
        }
        // 第三方库: 路径重写到预构建产物的路径
        if (BARE_IMPORT_RE.test(modSource)) {
          const bundlePath = normalizePath(
            path.join("/", PRE_BUNDLE_DIR, `${modSource}.js`)
          );
          ms.overwrite(modStart, modEnd, bundlePath);
          importedModules.add(bundlePath);
        } else if (modSource.startsWith(".") || modSource.startsWith("/")) {
          // change
          const resolved = await resolve(modSource, id);
          // end
          if (resolved) {
            ms.overwrite(modStart, modEnd, resolved);
            importedModules.add(resolved);
          }
        }
      }
      // add
      // 只对业务源码注入
      if (!id.includes("node_modules")) {
        // 注入 HMR 相关的工具函数
        ms.prepend(
          `import { createHotContext as __vite__createHotContext } from "${CLIENT_PUBLIC_PATH}";` +
            `import.meta.hot = __vite__createHotContext(${JSON.stringify(
              cleanUrl(curMod.url)
            )});`
        );
      }
      // end

      moduleGraph.updateModuleInfo(curMod, importedModules);

      return {
        code: ms.toString(),
        map: ms.generateMap(),
      };
    },
  };
}
```

#### HMR 工具函数

注入完成之后，还需要实现 `createHotContext`方法，主要向外暴露工具函数

```ts
// src/client/client.ts
interface HotModule {
  id: string;
  callbacks: HotCallback[];
}

interface HotCallback {
  deps: string[];
  fn: (modules: object[]) => void;
}

// HMR 模块表
const hotModulesMap = new Map<string, HotModule>();
// 不在生效的模块表
const pruneMap = new Map<string, (data: any) => void | Promise<void>>();

export const createHotContext = (ownerPath: string) => {
  const mod = hotModulesMap.get(ownerPath);
  if (mod) {
    mod.callbacks = [];
  }

  function acceptDeps(deps: string[], callback: any) {
    const mod: HotModule = hotModulesMap.get(ownerPath) || {
      id: ownerPath,
      callbacks: [],
    };
    // callbacks 属性存放 accept 的依赖、依赖改动后对应的回调逻辑
    mod.callbacks.push({
      deps,
      fn: callback,
    });
    hotModulesMap.set(ownerPath, mod);
  }

  return {
    accept(deps: any, callback?: any) {
      // 这里仅考虑接受自身模块更新的情况
      // import.meta.hot.accept()
      if (typeof deps === "function" || !deps) {
        acceptDeps([ownerPath], ([mod]) => deps && deps(mod));
      }
    },
    // 模块不再生效的回调
    // import.meta.hot.prune(() => {})
    prune(cb: (data: any) => void) {
      pruneMap.set(ownerPath, cb);
    },
  };
};
```

accept 函数中，会将需要接受更新的模块统一加入到 `hotModulesMap` 表中

#### 派发更新

```ts
// src/client/client.ts
async function fetchUpdate({ path, timestamp }: Update) {
  const mod = hotModulesMap.get(path);
  if (!mod) return;

  const moduleMap = new Map();
  const modulesToUpdate = new Set<string>();
  modulesToUpdate.add(path);

  await Promise.all(
    Array.from(modulesToUpdate).map(async (dep) => {
      const [path, query] = dep.split(`?`);
      try {
        // 通过动态 import 拉取最新模块
        const newMod = await import(
          path + `?t=${timestamp}${query ? `&${query}` : ""}`
        );
        moduleMap.set(dep, newMod);
      } catch (e) {}
    })
  );

  return () => {
    // 拉取最新模块后执行更新回调
    for (const { deps, fn } of mod.callbacks) {
      fn(deps.map((dep: any) => moduleMap.get(dep)));
    }
    console.log(`[vite] hot updated: ${path}`);
  };
}
```

这样就可以在收到通知的时候，将对应的所接受的模块进行替换，完成热更新。

#### css 实现热更新

```ts
// src/client/client.ts
const sheetsMap = new Map();

export function updateStyle(id: string, content: string) {
  let style = sheetsMap.get(id);
  if (!style) {
    // 添加 style 标签
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = content;
    document.head.appendChild(style);
  } else {
    // 更新 style 标签内容
    style.innerHTML = content;
  }
  sheetsMap.set(id, style);
}

export function removeStyle(id: string): void {
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
  }
  sheetsMap.delete(id);
}
```

向外暴露了两个函数，分别是更新/创建 style，并长时间提供更新、移除当前 style 标签

之后针对 css 插件 进行改造：

```ts
import { readFile } from "fs-extra";
import { CLIENT_PUBLIC_PATH } from "../constants";
import { Plugin } from "../plugin";
import { ServerContext } from "../server";
import { getShortName } from "../utils";

export function cssPlugin(): Plugin {
  let serverContext: ServerContext;
  return {
    name: "m-vite:css",
    // add
    configureServer(s) {
      serverContext = s;
    },
    // end
    load(id) {
      if (id.endsWith(".css")) {
        return readFile(id, "utf-8");
      }
    },
    // 主要变动在 transform 钩子中
    async transform(code, id) {
      if (id.endsWith(".css")) {
        // change
        // 包装成 JS 模块
        // 注入hmr相关内容，持续接受更新，并返回最新内容
        const jsContent = `
import { createHotContext as __vite__createHotContext } from "${CLIENT_PUBLIC_PATH}";
import.meta.hot = __vite__createHotContext("/${getShortName(
          id,
          serverContext.root
        )}");

import { updateStyle, removeStyle } from "${CLIENT_PUBLIC_PATH}"
  
const id = '${id}';
const css = \`${code.replace(/\n/g, "").replace(/"/g, "'")}\`;

updateStyle(id, css);
import.meta.hot.accept();
export default css;
import.meta.hot.prune(() => removeStyle(id));`.trim();
        // end
        return {
          code: jsContent,
        };
      }
      return null;
    },
  };
}
```

- 至此，完成了 hmr 热更新能力。

# 使用

创建一个[示例](https://github.com/sanyuan0704/juejin-book-vite/tree/main/mini-vite/playground)来使用

playground 中默认是以文件引入的形式去拉取的 mini-vite，也可以用 npm link 的形式去使用，如果是后者的话需要手动修改一下 package.json 中的引入

在 package.json 中注册命令：

```json
{
  "bin": {
    "mini-vite": "bin/mini-vite"
  }
}
```

随后 yarn install,安装后再 node_modules/.bin 查看自动安装的 mini-vite 命令。

随后 mini-vite 建议框架开启编译，随后启动示例项目，完成。
