---
highlight: monokai
theme: github
---

# 说明

这个架构是以 island.js 为对象，进行模仿，以实现 SSG 静态站点生成。\
描述开发过程中的一些重要 plugin 以及一些实现手段。

## 技术栈 vite/react/react-router-dom/unocss

# Plugins

## 启动项目时，响应一段 HTML 内容

可以应用到骨架屏处理中\
利用`configureServer`钩子，在中间件中执行一个自定义插件，设定 header 并返回指定的转换后的 html 内容，然后在 transformIndexHtml 钩子中将 html 的 script 进行自动插入入口文件

- DEFAULT_HTML_PATH----HTML 模板路径
- CLIENT_ENTRY_PATH---客户端执行文件路径

```typescript
import { readFile } from "fs/promises";
import { Plugin } from "vite";
import { CLIENT_ENTRY_PATH, DEFAULT_HTML_PATH } from "../constants";
export default function pluginIndexHtml(): Plugin {
  return {
    name: "zisland:index-html",
    apply: "serve",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`,
            },
            injectTo: "body",
          },
        ],
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, "utf-8");
          html = await server.transformIndexHtml(
            req.url,
            html,
            req.originalUrl
          );
          try {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    },
  };
}
```

# 服务端运行 SSG

## 打包服务端代码

通过 vite 打包工具，对服务端和运行端分别进行打包的产出设置，封装为函数
plugins 中的`createVitePlugins`函数为抽出的一个方法，返回 plugins 数组
![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c147f8ac6c1d41e59085a837ed3a6e28~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=1590&s=228747&e=png&b=272823)
单独获取到指定的 boundle，然后在服务端入口文件内，拿到 render 函数（toString 之后的指定路径的内容（`renderToString`））以及约定式路由生成的 routes。
随后在 Promise.all 内，根据产出的 routes 遍历，根据每一份的 route.path，调用 render 函数(入口文件内导出的 render 函数)得到返回的 appHtml。
创建一个 html 模板，在内部动态根据 bound 的 chunk 分别动态插入 link、script、以及 appHtml 内容，随后分别写入到指定的导出目录中。

- 模板展示

```typescript
const clientChunk = boundle.output.find(
  (chunk) => chunk.isEntry && chunk.type === "chunk"
);
const zislandAssets = boundle.output.filter(
  (item) => item.type === "asset" && item.fileName.endsWith(".css")
);
const html = `
<!DOCTYPE html>
<html>
  <head> 
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="xxx">
    ${zislandAssets
      .map((assets) => `<link rel="stylesheet" href="/${assets.fileName}" >`)
      .join("\n")}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    </body>
    <script type="module" src="/${clientChunk?.fileName}"></script>
    </html>
    `.trim();
const fileName = routePath.endsWith("/")
  ? `${routePath}index.html`
  : `${routePath}.html`;
await fs.ensureDir(path.join(root, CLIENT_OUTPUT, path.dirname(fileName)));
await fs.writeFile(path.join(root, CLIENT_OUTPUT, fileName), html);
```

# 虚拟模块

## 访问配置文件内的内容

入参接受 A-config 配置项 Object，B-服务器重启函数

```typescript
import type { Plugin } from "vite";
import { join } from "path";
import fs from "fs-extra";

import { SiteConfig } from "shared/types";
import { PACKAGE_ROOT } from "node/constants";

const PRESET_SITE_DATA_ID = "zisland:site-data";

export default function pluginConfig(
  config: SiteConfig,
  restartServer?: () => Promise<void>
): Plugin {
  return {
    name: "zisland:config",
    resolveId(id) {
      // 拦截到引入名称  import siteData from 'zisland:site-data',拦截到之后添加 \0 前缀，标明为虚拟模块（\0为vite指定标识）
      if (id === PRESET_SITE_DATA_ID) {
        return "\0" + PRESET_SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === "\0" + PRESET_SITE_DATA_ID) {
        // 拦截到标识后的名称，进行自定义导出内容
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    // 配置config文件更新之后热更新，重启服务
    async handleHotUpdate(ctx) {
      const targetWatchFilePaths = [config.configPath];
      const include = (id: string) =>
        targetWatchFilePaths.some((file) => id.includes(file));
      if (include(ctx.file)) {
        await restartServer();
      }
    },
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            "@runtime": join(PACKAGE_ROOT, "src", "runtime", "index.ts"),
          },
        },
        css: {
          modules: {
            // style变量配置名称转换为驼峰
            localsConvention: "camelCaseOnly",
          },
        },
      };
    },
  };
}
```

## 实现约定式路由以及配合虚拟模块引入

- 约定式路由--约定式路由一般指文件系统路由，页面的文件路径会简单映射为路由的路径

`例如，如果在 docs 目录中有一个名为 example.md 的文件，则该文件的路由路径将是 /example。`
客户端与服务端的展现形式不同，分别是：

```typescript
// client
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { BrowserRouter } from "react-router-dom";

function renderInBrowser() {
  const containerEl = document.getElementById("root");
  if (!containerEl) {
    throw new Error("#root element not found");
  }
  createRoot(containerEl).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
renderInBrowser();

// server
import { App } from "./app";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

// 这里的render函数向外提供，也就是上面的renderPage中，routes.map时里面的render函数
export function render(pagePath: string) {
  return renderToString(
    <StaticRouter location={pagePath}>
      <App />
    </StaticRouter>
  );
}
```

### 虚拟模块实现

```typescript
// index.ts
import { Plugin } from "vite";
import RouteService from "./routeService";
import { PageModule } from "shared/types";

interface PluginOptions {
  root: string;
  isSSR: boolean;
}

export interface Route {
  path: string;
  element: React.ReactElement;
  filePath: string;
  preload: () => Promise<PageModule>;
}

export const PLUGON_ROUTES_ID = "zisland:routes";

const pluginRoutes = (options: PluginOptions): Plugin => {
  // 创建类
  const routerService = new RouteService(options.root);

  return {
    name: "zisland:routes",
    async configResolved() {
      // 初始化将指定目录内所有检索到的路径规范化并记录
      await routerService.init();
    },
    resolveId(id: string) {
      if (id === PLUGON_ROUTES_ID) {
        return "\0" + id;
      }
    },
    load(id: string) {
      if (id === "\0" + PLUGON_ROUTES_ID) {
        // 根据记录内容批量生成并返回
        return routerService.generateRoutesCode(options.isSSR || false);
      }
    },
  };
};

export default pluginRoutes;
```

### RouteService 类实现

```typescript
import fastGlob from "fast-glob";
import path from "path";
import { normalizePath } from "vite";

interface RouteMeta {
  routePath: string;
  absolutePath: string;
}

class RouteService {
  // 扫描路径
  #scanDir: string;
  #routeData: RouteMeta[] = [];
  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }
  init() {
    // 检索并返回指定类型的文件信息
    const files = fastGlob
      .sync(["**/*.{js,jsx,ts,tsx,md,mdx}"], {
        absolute: true, // 绝对路径
        cwd: this.#scanDir,
        ignore: ["**/node_modules/**", "**/build/**", "config.ts"], // 排除项
      })
      .sort(); // 规范化排序

    files.map((file) => {
      const fileRelativePath = normalizePath(
        path.relative(this.#scanDir, file)
      );
      const routePath = this.normallizeRoutePath(fileRelativePath);
      this.#routeData.push({
        routePath,
        absolutePath: file,
      });
    });
  }
  getRouteMeta(): RouteMeta[] {
    return this.#routeData;
  }
  normallizeRoutePath(path: string) {
    // 去除后缀 guide/a.tsx --- guide/a
    const routePath = path.replace(/\.(.*)?$/, "").replace(/index$/, "");
    console.log(path, routePath);
    return routePath.startsWith("/") ? routePath : `/${routePath}`;
  }
  generateRoutesCode(ssr: boolean) {
    // 客户端进行组件的按需加载，导出块时加入preload函数，返回此文件内的所有导出，包含默认导出代码块以及其他一些附着在文件内数据的导出
    return `
      import React from 'react'
      ${ssr ? "" : 'import loadable from "@loadable/component"'}

      ${this.#routeData
        .map((route, index) =>
          ssr
            ? `import Route${index} from '${route.absolutePath}'`
            : `const Route${index} = loadable(() => import('${route.absolutePath}'))`
        )
        .join("\n")}

      export const routes = [
        ${this.#routeData
          .map(
            (route, index) =>
              `{ path: '${route.routePath}', element: React.createElement(Route${index}), preload: () => import('${route.absolutePath}') }`
          )
          .join(",\n")}
      ]
    `;
  }
}

export default RouteService;
```

### 使用以及 initPageData 函数的构建

- Content.tsx 组件展示路由内内容

```typescript
import { useRoutes } from "react-router-dom";
import { routes } from "zisland:routes";

export const Content = () => {
  const routeElements = useRoutes(routes);
  return routeElements;
};
```

- routes 内导出的 preload 函数内内容使用：
  定义 initPageData 函数，在每一次客户端，服务端 render 时调用。

```typescript
import { PageData } from "shared/types";
import { routes } from "zisland:routes";
import { matchRoutes } from "react-router-dom";
import siteData from "zisland:site-data";

// 接受当前页面的pagepath
export const initPageData = async (routePath: string): Promise<PageData> => {
  // 利用react-router-dom内的matchRoutes函数获取到当前path下的route内容，此内容在之前的生成路由插件中导出了额外的内容，包含preload函数
  const matched = matchRoutes(routes, routePath);
  if (matched) {
    // 引入当前页面内的所有导出
    const moduleInfo = await matched[0].route.preload();
    return {
      pagePath: routePath,
      pageType: moduleInfo.frontmatter?.pageType || "doc", // 在mdx中定义的页面类型
      frontmatter: moduleInfo.frontmatter, // mdx中的内容项
      siteData: siteData, // 文档配置项内容
      toc: moduleInfo?.toc || [], // 右侧定位栏，下文提及
      title: moduleInfo?.title || "",
    };
  } else {
    return {
      pagePath: routePath,
      pageType: "404",
      frontmatter: {},
      siteData,
      toc: [],
      title: "404",
    };
  }
};
```

# [MDX](https://mdxjs.com/playground/)编译工具的插件

- initPageData 函数功能是将注入在页面内的子导出项获取，利用 useContext 注入到项目中，即可以在每一个页面使用这个函数返回的当前页面信息

## Vite 中接入 MDX 编译能力

```typescript
// index.ts
import { Plugin } from "vite";
import { pluginMdxRollup } from "./pluginMdxRollup";
import { pluginMdxHmr } from "./pluginMdxHmr";

export async function pluginMdx(): Promise<Plugin[]> {
  return [await pluginMdxRollup()];
}

// pluginMdxRollup.ts
import pluginMdx from "@mdx-js/rollup";
export function pluginMdxRollup() {
  return [
    pluginMdx({
      remarkPlugins: [],
      rehypePlugins: [],
    }),
  ];
}
```

## [remark](https://github.com/gnab/remark)

### GFM-markdown 语法规范

```json
yarn add emark-gfm
```

### 解析页面元信息

```json
yarn add remark-frontmatter remark-mdx-frontmatter
```

```typescript
// 解析页面元信息
import remarkPluginFrontmatter from "remark-frontmatter";
import remarkPluginMDXFrontmatter from "remark-mdx-frontmatter";

remarkPlugins: [
  remarkPluginFrontmatter,
  [remarkPluginMDXFrontmatter, { name: "frontmatter" }],
];
```

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3943f68549e248c7ad1e3428ebc014c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=240&s=41680&e=png&b=2c2d28)
![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26b0e473961b4b40a57bb9c60368f660~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1850&h=186&s=96936&e=png&b=232427)
这样就可以在 initPageData 函数中获取到对应的元数据。

### toc 大纲栏数据生成

- 从页面的 h2---h5 中提取标题，自动生成数组，注入到页面中，再利用 initPageData 获取到数据

```json
yarn add github-slugger mdast-util-mdxjs-esm acorn
```

```typescript
import type { Plugin } from "unified";
import Slugger from "github-slugger";
import { visit } from "unist-util-visit";
import { Root } from "hast";
import type { MdxjsEsm, Program } from "mdast-util-mdxjs-esm";
import { parse } from "acorn";

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface ChildNode {
  type: "link" | "text" | "inlineCode";
  value: string;
  children?: ChildNode[];
}

export const remarkPluginTOC: Plugin<[], Root> = () => {
  return (tree) => {
    const toc: TocItem[] = [];
    const slugger = new Slugger();
    let title = "";
    // 查找 heading 类型
    visit(tree, "heading", (node) => {
      // depth 1---5  -> h1 --- h5
      // 不是标题类节点且没子项进行排除
      if (!node.depth || !node.children) {
        return;
      }
      // 拦截h1为title
      if (node.depth === 1) {
        title = (node.children[0] as ChildNode).value;
      }
      // h1 --- h4
      if (node.depth > 1 && node.depth < 5) {
        const originText = (node.children as ChildNode[])
          .map((child) => {
            // 如果是一个link节点，获取子节点的文本，否则就直接获取文本
            switch (child.type) {
              case "link":
                return child.children?.map((c) => c.value).join("") || "";
              default:
                return child.value;
            }
          })
          .join("");
        // 生成唯一ID
        const id = slugger.slug(originText);
        toc.push({
          id,
          text: originText,
          depth: node.depth,
        });
      }
    });
    // 生成需要在页面内导出的模块的代码
    const insertCode = `export const toc = ${JSON.stringify(toc, null, 2)}`;

    // 当前节点树下进行插入
    tree.children.push({
      type: "mdxjsEsm",
      value: insertCode,
      data: {
        estree: parse(insertCode, {
          ecmaVersion: 2020,
          sourceType: "module",
        }) as unknown as Program,
      },
    } as MdxjsEsm);

    // title同理
    if (title) {
      const insertTitle = `export const title = '${title}'`;
      tree.children.push({
        type: "mdxjsEsm",
        value: insertTitle,
        data: {
          estree: parse(insertTitle, {
            ecmaVersion: 2020,
            sourceType: "module",
          }) as unknown as Program,
        },
      } as MdxjsEsm);
    }
  };
};
```

- 直接在 remarkPlugins 下引入即可

## [rehype](https://github.com/rehypejs/rehype)

### 标签自动增加锚点供点击

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96752b62b2ba43ec992fd86ec63d1e4e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1724&h=386&s=102381&e=png&b=fdfdfd)

```json
yarn add rehype-autolink-headings rehype-slug
```

```typescript
// 添加#锚点模块
import rehypePluginAutolinkHeaderings from "rehype-autolink-headings";
import rehypePluginSlug from "rehype-slug";

rehypePlugins: [
  rehypePluginSlug,
  [
    rehypePluginAutolinkHeadings,
    {
      // 锚点设置类名
      properties: {
        class: "header-anchor",
      },
      // 锚点的内容
      content: {
        type: "text",
        value: "#",
      },
    },
  ],
];
```

### 代码块编译

```json
yarn add unist-util-visit @types/hast -D
```

```typescript
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";

export const rehypePluginPreWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    // 遍历节点
    visit(tree, "element", (node) => {
      // 标签为pre，且子元素是element并且是code标签，且过滤筛选标识以避免无限调用
      if (
        node.tagName === "pre" &&
        node.children[0]?.type === "element" &&
        node.children[0].tagName === "code" &&
        !node.data?.isVisit
      ) {
        const codeNode = node.children[0];
        const codeNodeClassName =
          codeNode.properties?.className?.toString() || "";
        // language-js --> js
        const lang = codeNodeClassName.split("-")[1];

        const cloneNode: Element = {
          type: "element",
          tagName: "pre",
          children: node.children,
          properties: node.properties,
          data: {
            isVisit: true,
          },
        };

        // 将原有的pre更改为div
        node.tagName = "div";
        node.properties = node.properties || {};
        node.properties.className = codeNodeClassName;

        // 在div中注入span以及之前的pre
        node.children = [
          {
            type: "element",
            tagName: "span",
            properties: {
              className: "lang",
            },
            children: [
              {
                type: "text",
                value: lang,
              },
            ],
          },
          cloneNode,
        ];
      }
    });
  };
};
```

### 代码高亮

```json
yarn add shiki hast-util-from-html
```

```typescript
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Text, Root } from "hast";
import { fromHtml } from "hast-util-from-html";
import shiki from "shiki";

interface Options {
  highlighter: shiki.Highlighter;
}

export const rehypePluginShiki: Plugin<[Options], Root> = ({ highlighter }) => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      // 筛选出需要处理的节点
      if (
        node.tagName === "pre" &&
        node.children[0]?.type === "element" &&
        node.children[0].tagName === "code"
      ) {
        const nodeCode = node.children[0];
        const nodeCodeText = (nodeCode.children[0] as Text).value;
        const nodeClassName = nodeCode.properties?.className?.toString() || "";
        const lang = nodeClassName.split("-")[1];
        if (!lang) {
          return;
        }

        // shiki高亮处理
        const highlightedCode = highlighter.codeToHtml(nodeCodeText, { lang });
        // 将处理后的string转换成AST
        const formatterAST = fromHtml(highlightedCode, { fragment: true });
        parent.children.splice(index, 1, ...formatterAST.children);
      }
    });
  };
};
```

注册插件

```typescript
rehypePlugins: [
  [
    rehypePluginShiki,
    {
      // 高亮颜色模式
      highlighter: await shiki.getHighlighter({ theme: "nord" }),
    },
  ],
];
```

## mdx 文件热更新边界异常修复

react\&vite 中，组件级别的更新是由`@vitejs/plugin-react`完成的，这个插件又依赖`react-refresh`，通过在组件中插入相关的`react-refresh`运行时代码完成组件的热更新。
这个插件也会在组件中插入`import.meta.hot.accept`的调用，当发生更新，就会重新执行代码，然后由于之前`react-refresh`的运行时启用，数据也就会得以保存。
.mdx 文件热更新失效是因为插件只接受 React 组件的处理，这个判定界限是根据文件名称内所有导出内容的首字母是否为大写进行判定，正常驼峰写法必然会出现差错，所以热更新失效。
处理方式就是将对应后缀的文件内注入热更新代码以及运行时代码，在热更新时能检索到这个边界，从而正常热更新。

```typescript
import { Plugin } from "vite";
import assert from "assert";

export function pluginMdxHmr(): Plugin {
  let viteReactPlugin: Plugin;
  return {
    name: "vite-plugin-mdx-hmr",
    apply: "serve",
    configResolved(config) {
      // 获取到热更新插件
      viteReactPlugin = config.plugins.find(
        (p) => p.name === "vite:react-babel"
      ) as Plugin;
    },
    async transform(code, id, opts) {
      if (/\.mdx?$/.test(id)) {
        // 断言工具函数 等同if，false时会中断运行
        assert(typeof viteReactPlugin.transform === "function");
        // 利用插件手动进行代码的转换
        const result = await viteReactPlugin.transform?.call(
          this,
          code,
          id + "?.jsx", // 运行时会因为jsx的后缀进行React的hmr注入
          opts
        );
        const selfAcceptCode = "import.meta.hot.accept();";
        if (
          typeof result === "object" &&
          !result!.code?.includes(selfAcceptCode)
        ) {
          // 不包含 accept 函数的code进行手动注入
          result!.code += selfAcceptCode;
        }
        return result;
      }
    },
    // 将正文页面与toc导航栏挂钩，新增标题标签可以同步热更新至toc
    handleHotUpdate(ctx) {
      if (/\.mdx?/.test(ctx.file)) {
        // 这个地方有一些歧义，使用原本的 ctx.file 时间戳会多 1 导致对不上。
        // 这里获取到ctx的元数据进行组装
        const location = ctx.server.httpServer._connectionKey.slice("2");
        const path = ctx.file.slice(ctx.server.config.root.length);

        // 发送自定义热更新
        ctx.server.ws.send({
          type: "custom",
          event: "mdx-changed",
          data: {
            filePath: "http://" + location + path,
          },
        });
      }
    },
  };
}
```

实时更新 toc 模块数据，导航栏中代替原本 initPageData 函数中导出的 toc

```typescript
import { useEffect, useState } from "react";
import { Header } from "shared/types";

export const useHeaders = (initheaders: Header[]) => {
  const [headers, setHeadaers] = useState(initheaders);

  useEffect(() => {
    if (import.meta.env.DEV) {
      // 拦截自定义更新
      import.meta.hot.on(
        "mdx-changed",
        ({ filePath }: { filePath: string }) => {
          // 引入最新的file模块
          import(/* @vite-ignore */ `${filePath}?import&t=${Date.now()}`).then(
            (module) => {
              // 同步更新toc
              setHeadaers(module.toc);
            }
          );
        }
      );
    }
  });

  return headers;
};
```

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e914d8016784a65a1acf47adbe9f064~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1130&h=790&s=155917&e=png&b=282924)

# zisland 架构内细节函数

## 部分组件 hydration 注入

1.  定义特殊属性表示需要 hydration 的组件
2.  获取到这些组件并将属性进行转化，传入对应的参数（引入/被引入）
3.  挂载到 window 全局并注入到 HTML 中

### babel 实现特殊属性转化参数

```typescript
// 转换前
<Button __zisland />

// 转换后
<Button __zisland="../comp/export.ts!!ZISLAND!!/User/import.ts" />
```

```json
yarn  add @babel/core @babel/preset-react @babel/traverse @babel/helper-plugin-utils
```

```typescript
import { declare } from "@babel/helper-plugin-utils";
import type { Visitor } from "@babel/traverse";
import type { PluginPass } from "@babel/core";
import { types as t } from "@babel/core";
import { MASK_SPLITTER } from "./constants"; // ----!!ZISLAND!!
import { normalizePath } from "vite";
export default declare((api) => {
  api.assertVersion(7);

  const visitor: Visitor<PluginPass> = {
    // 这里捕获到jsx标签
    JSXOpeningElement(path, state) {
      const name = path.node.name;
      let bindingName = "";

      // 获取到组件名称
      if (name.type === "JSXIdentifier") {
        // 单导出组件
        bindingName = name.name;
      } else if (name.type === "JSXMemberExpression") {
        // A.B.C类型组件，持续遍历到最深处获取
        let object = name.object;
        while (t.isJSXMemberExpression(object)) {
          object = object.object;
        }
        bindingName = object.name;
      } else return;

      // 根据作用域信息获取引入位置
      const binding = path.scope.getBinding(bindingName);
      if (binding?.path.parent.type === "ImportDeclaration") {
        // 定位到import语句，拿到对应的引入路径
        const source = binding.path.parent.source;
        const attirbutes = (path.container as t.JSXElement).openingElement
          .attributes;
        for (let i = 0; i < attirbutes.length; i++) {
          const name = (attirbutes[i] as t.JSXAttribute).name;
          if (name?.name === "__zisland") {
            // 将属性名称的value进行赋值
            attirbutes[i].value = t.stringLiteral(
              `${source.value}${MASK_SPLITTER}${normalizePath(
                state.filename || ""
              )}`
            );
          }
        }
      }
    },
  };

  return {
    name: "transfrom-jsx-zisland",
    visitor,
  };
});
```

### 拦截并记录 zisland 属性内信息

实现这点需要通过拦截 react-jsx/runtime 模块，自定义 JSX Rumtime，通过 props 来进行拦截以及记录。

```typescript
import * as jsxRuntime from "react/jsx-runtime";

const originJsx = jsxRuntime.jsx;
const originJsxs = jsxRuntime.jsxs;

export const data = {
  zislandProps: [],
  zislandToPathMap: {},
};

const internalJsx = (jsx, type, props, ...args) => {
  // 拦截并记录
  if (props && props.__zisland) {
    data.zislandProps.push(props);
    const id = type.name;
    data["zislandToPathMap"][id] = props.__zisland;

    delete props.__zisland;

    // 外部添加一个容器记录zisland的信息，赖标识组件ID以及位置
    return jsx("div", {
      __zisland: `${id}:${data.zislandProps.length - 1}`,
      children: jsx(type, props, ...args),
    });
  }
  return jsx(type, props, ...args);
};

// 自定义jsx和jsxs，以及携带的Fragment
export const jsx = (...args) => internalJsx(originJsx, ...args);
export const jsxs = (...args) => internalJsx(originJsxs, ...args);
export const Fragment = jsxRuntime.Fragment;

// 提供清空数据函数，避免污染
export const clearRuntimeData = () => {
  data.zislandProps = [];
  data.zislandToPathMap = {};
};
```

- vite plugins 中引入

```typescript
import { Plugin } from "vite";
import pluginReact from "@vitejs/plugin-react";

import { SiteConfig } from "shared/types";
import { join } from "path";
import { PACKAGE_ROOT } from "./constants";
import babelPluginZisland from "./babel-plugin-zisland";

export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR: boolean = false
): Promise<Plugin[]> {
  return [
    pluginReact({
      // 可以避免 React is not defined 报错，每个文件不用引入react，且不会jsx/runtime，自定义runtime会失效，且更加高效一些
      jsxRuntime: "automatic",
      jsxImportSource: isSSR ? join(PACKAGE_ROOT, "src", "runtime") : "react",
      babel: {
        // 之前的babel插件
        plugins: [babelPluginZisland],
      },
    }),
  ] as Plugin[];
}
```

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32249ab80e1846ee9f17a2d9e7136611~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=722&s=196560&e=png&b=272823)

**注：如果使用 automatic 方式，就不能在组件中使用 ...props 语法，这样会将组件编译为 React.createElement 的格式，不符合预期**

```html
<menuitem {...item} key="{item.text}" /> // 不行
<menuitem item="{item}" key="{item.text}" /> // 可以
```

### zisland 组件打包

1.  首先现在 build.ts 中获取到上文导出的 props 以及 pathMap
2.  新建 buildZislands 函数，传入 pathMap 进行组件打包的处理

期望：

```js
import { Button } from "path...";

// 全局注册 Islands 组件
window.ZISLANDS = { Button };
// 注册 Islands 组件的 props 数据
window.ZISLAND_PROPS = JSON.parse(
  document.getElementById("zisland-props").textContent
);
```

实现：

```typescript
const buildZislands = async (
  root: string,
  zislandPathToMap: Record<string, string>
) => {
  const zislandsInjectCode = `
  ${Object.entries(zislandPathToMap)
    .map(
      ([islandName, islandPath]) =>
        `import { ${islandName} } from '${islandPath}'`
    )
    .join("")}
window.ZISLANDS = { ${Object.keys(zislandPathToMap).join(", ")} };
window.ZISLAND_PROPS = JSON.parse(
document.getElementById('zisland-props').textContent
);
`;
  const injectId = "zisland:inject";
  return viteBuild({
    mode: "production",
    esbuild: {
      jsx: "automatic", // 保证以jsx/runtime执行
    },
    build: {
      outDir: path.join(root, ".temp"),
      rollupOptions: {
        input: injectId,
        external: EXTERNALS,
      },
    },
    plugins: [
      {
        name: "zisland:inject",
        enforce: "post",
        resolveId(id) {
          // !!ZISLAND!!
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER);
            // 获取到 以引入者的为中心的导出路径 的组件, 跳过本插件避免无限循环
            return this.resolve(originId, importer, { skipSelf: true });
          }
          if (id === injectId) {
            return id;
          }
        },
        load(id) {
          if (id === injectId) {
            return zislandsInjectCode;
          }
        },
        // 独立的模块只需要js，静态文件可以进行删除
        generateBundle(_, boundle) {
          for (const name in boundle) {
            if (boundle[name].type === "asset") {
              delete boundle[name];
            }
          }
        },
      },
    ],
  });
};
```

打包完成之后，就可以在原先的 renderPage 函数中的 html 模板中进行 css，js，全局 ZISLANDS、ZISLANDS_PROPS 的引入了

```typescript
const zislandBundle = await buildZislands(root, zislandToPathMap);

const zislandCode = (zislandBundle as RollupOutput).output[0].code;
```

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a1a9d89b04e4c079fee5388476d4814~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120&h=1258&s=232696&e=png&b=272823)

### 生产/开发环境区分

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa09a59e40ff45b2a450d03d46e82a5b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1228&h=1780&s=397086&e=png&b=282924)

### 部分组件 Hydration 后 react 多实例报错处理

处理步骤

1.  单独打包 react 相关代码
2.  将之前构建代码中的 react 相关进行排除（external）
3.  利用 `Improt Maps`强制指定 react 为之前打包好的产物，从而避免多实例

#### Import Maps

script 标签 type 属性设置为 `importmap`，内包含一个对象，内包含 imports 对象，内 key 为指定的名称，value 为产物路径，也可以为 CDN 格式

```html
<script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/stable/react@18.2.0/es2022/react.js",
      "react-dom/client": "https://esm.sh/stable/react-dom@18.2.0/es2022/client.js"
    }
  }
</script>
```

实现

```json
yarn add esbuild resolve
```

```typescript
import path from "path";
import fs from "fs-extra";
import { build } from "esbuild";
import resolve from "resolve";
import { normalizePath } from "vite";

const PRE_BUNDLE_DIR = "vendors";

const preBundle = async (deps: string[]) => {
  const flattenDepMap = {} as Record<string, string>;

  for (const dep of deps) {
    // / ---> _
    const flattenName = dep.replace(/\//g, "_");
    flattenDepMap[flattenName] = dep;
  }
  const outputAbsolutePath = path.join(process.cwd(), PRE_BUNDLE_DIR);

  if (await fs.pathExists(outputAbsolutePath)) {
    await fs.remove(outputAbsolutePath);
  }

  await build({
    entryPoints: flattenDepMap,
    outdir: PRE_BUNDLE_DIR,
    bundle: true,
    minify: true,
    splitting: true,
    format: "esm",
    platform: "browser",
    plugins: [
      {
        name: "pre-bundle",
        setup(build) {
          // bare import 裸导入 -> import react from 'react'
          build.onResolve({ filter: /^[\w@][^:]/ }, async (args) => {
            if (!deps.includes(args.path)) {
              return;
            }
            const isEntry = !args.importer;
            const resolved = resolve.sync(args.path, {
              basedir: args.importer || process.cwd(),
            });
            // 将导入的入口文件设置tag
            return isEntry
              ? { path: resolved, namespace: "dep" }
              : { path: resolved };
          });
          build.onLoad({ filter: /.*/, namespace: "dep" }, async (args) => {
            // 拦截指定的tag，自定义内容，得以导出
            const entryPath = normalizePath(args.path);
            const res = require(entryPath);
            const depNames = Object.keys(res);

            return {
              contents: `
                export { ${depNames.join(", ")} } from '${entryPath}';
                export default require('${entryPath}')
              `,
              loader: "js",
              resolveDir: process.cwd(),
            };
          });
        },
      },
    ],
  });
};

preBundle(["react", "react-dom", "react-dom/client", "react/jsx-runtime"]);
```

直接在 package.json 中定义脚本，tsx preBundle 文件路径，进行 vendor 目录的生成。
bundle 函数中的 html 新增对 Import Map 的引入
![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aef6d3253c76428e9ab4e8f721baffb4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1202&h=1302&s=278217&e=png&b=272823)

- EXTERNALS 常量为设定好需要单独打包的包名称

```js
// constant.ts
export const EXTERNALS = [
  "react",
  "react-dom",
  "react-dom/client",
  "react/jsx-runtime",
];
```

还需要将 vendor 文件夹移动到最终的产物中（fs.copy）

## 自定义 head 内容

```json
yarn add react-helmet-async@1.3.0
```

分别在客户端和服务端接入
![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb2777adf949437b81b90732a1097b11~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1210&h=1346&s=325294&e=png&b=282924)
服务端参数由 build.ts/renderPage 函数调用 render 函数返回，客户端则不需要这个参数。
![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f381502c67942b8b1bd6bf8ff65435b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1220&h=1900&s=443972&e=png&b=282924)

- 这里的 title 可以从之前的 toc---depth===1 时（h1 标签）获取其中的 value 并返回到 moduleInfo 中，在页面的 usePageData 函数中取到（initPageData 的 context）

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa1d9131ca234239871ebccab204bb39~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1158&h=1646&s=286071&e=png&b=282924)

## 静态资源预览 preview

**这个功能不知道为什么我这边一直报错，还在排查 ing...**

```json
yarn add polka compress
```

```typescript
// node/preview.ts
import path from "path";
import { resolveConfig } from "./config";
import sirv from "sirv";
import compression from "compression";
import polka from "polka";
import fs from "fs-extra";

export const preview = async (root: string, port: number) => {
  const config = await resolveConfig(root, "serve", "production");
  const outputDir = path.resolve(root, "build");
  const listenPort = port || 9000;
  const notFoundFile = fs.readFileSync(
    path.resolve(outputDir, "404.html"),
    "utf-8"
  );
  // 提供压缩代码功能的中间件
  const compress = compression();

  // 静态资源
  const serve = sirv(outputDir, {
    etag: true,
    maxAge: 31536000,
    immutable: true,
    setHeaders(res, pathname) {
      if (pathname.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  });

  // 加入404页面
  const onNoMatch: polka.Options["onNoMatch"] = (req, res) => {
    res.statusCode = 404;
    res.end(notFoundFile);
  };
  // 启动服务
  polka({ onNoMatch })
    .use(compress, serve)
    .listen(listenPort, (err) => {
      if (err) {
        throw err;
      }
      console.log(
        "preview build for production: http://localhost:" + listenPort
      );
    });
};
```

```typescript
// cli文件内加入命令，调用preview函数
cli
  .command("preview [root]", "preview build of production")
  .option("--port <port>", "port to use for preview server")
  .action(async (root: string, { port }: { port?: number }) => {
    try {
      root = resolve(root);
      await preview(root, port);
    } catch (e) {
      console.log("err", e);
    }
  });
```

# 自动化发布

```json
yarn add chalk execa enquirer semver minimis -D
```

- chalk--终端设置文字颜色
- execa--指定命令的工具
- enquirer--终端交互式命令
- semver--根据规范语义化版本
- minimis--命令解析工具

```typescript
import chalk from "chalk";
import execa from "execa";
import { prompt } from "enquirer";
import semver from "semver";
import minimist from "minimist";
import { createRequire } from "module";
import fs from "fs-extra";
import path from "path";

const require = createRequire(import.meta.url);

// 从第三个参数开始获取 yarn relase --dep   dep开始
const args = minimist(process.argv.slice(2));

const isDry = args.dry;

const versionIncrements = ["patch", "minor", "major"] as const;

const pkg = require("../package.json");
const currentVersion = pkg.version;

const directRun = (bin: string, args: string[]) => {
  return execa(bin, args, { stdio: "inherit" });
};

const dirRun = (bin: string, args: string[]) => {
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(" ")}`));
  return;
};

// 根据命令判断是执行还是log测试
const run = isDry ? dirRun : directRun;

const step = (msg) => console.log(chalk.cyan(msg));

const updateVersion = (version: string) => {
  pkg.version = version;
  fs.writeFileSync(
    path.resolve(__dirname, "../package.json"),
    JSON.stringify(pkg, null, 2)
  );
};

const main = async () => {
  // 1. 确定变动版本级别 `patch-0.0.1 | minor-0.1 | major-1`，遵循 semver 规范。
  const { release } = await prompt<{ release: string }>({
    type: "select",
    name: "release",
    message: "Select release type",
    // 原先版本1.0.0 -> 1.0.1/1.1.0/2.0.0
    choices: versionIncrements.map(
      (i) => `${i} (${semver.inc(currentVersion, i)})`
    ),
  });
  const targetVersion = release.match(/\((.*)\)/)![1];

  // 二次确认
  const { confirm } = await prompt<{ confirm: boolean }>({
    type: "confirm",
    name: "confirm",
    message: `Releasing ${targetVersion}. Confirm?`,
  });

  if (!confirm) {
    return;
  }

  // 2. 执行测试
  step("\nRunning tests...");
  await run("yarn", ["test:unit"]);
  await run("yarn", ["test:e2e"]);

  // 3. 自动修改包版本
  if (!isDry) {
    step("\nUpdate version...");
    updateVersion(targetVersion);
  }

  // 4. 执行 yarn build
  step("\nBuilding package...");
  await run("yarn", ["build"]);

  // 5. 生成 CHANGELOG.md（后面会补充 changelog 命令）
  step("\nGenerating changelog...");
  await run("yarn", ["changelog"]);

  // 6. 生成 release commit
  step("\nCommitting changes...");
  await run("git", ["add", "-A"]);
  await run("git", ["commit", "-m", `'release: v${targetVersion}'`]);

  // 7. 执行 npm publish
  step("\nPublishing packages...");
  await run("yarn", ["publish", "--access", "public"]);

  // 8. git push 并打 tag
  step("\nPushing to GitHub...");
  await run("git", ["tag", `v${targetVersion}`]);
  await run("git", ["push", "origin", `refs/tags/v${targetVersion}`]);
  await run("git", ["push"]);
};

main().catch((err) => {
  // 错误兜底处理，回退版本
  console.log(err);
  updateVersion(currentVersion);
});
```

# package.json---installs

```json
"devDependencies": {
  "@commitlint/cli": "^17.6.7",
  "@commitlint/config-conventional": "^17.6.7",
  "@iconify-json/carbon": "^1.1.20",
  "@playwright/test": "1.26.1",
  "@types/fs-extra": "^11.0.1",
  "@types/hast": "^3.0.0",
  "@types/lodash": "^4.14.197",
  "@types/mdast": "^4.0.0",
  "@types/node": "^18.11.7",
  "@types/react": "^18.0.24",
  "@types/react-dom": "^18.0.8",
  "@types/resolve": "^1.20.2",
  "@typescript-eslint/eslint-plugin": "^6.3.0",
  "@typescript-eslint/parser": "^6.3.0",
  "@vitest/ui": "0.25.2",
  "commitlint": "^17.6.7",
  "conventional-changelog-cli": "^4.0.0",
  "eslint": "^8.46.0",
  "eslint-config-prettier": "^9.0.0",
  "eslint-plugin-prettier": "^5.0.0",
  "eslint-plugin-react": "^7.33.1",
  "eslint-plugin-react-hooks": "^4.6.0",
  "execa": "5.1.1",
  "ora": "^7.0.1",
  "prettier": "^3.0.1",
  "rehype-stringify": "^9.0.4",
  "remark-parse": "^10.0.2",
  "remark-rehype": "^10.1.0",
  "rollup": "^3.27.2",
  "sass": "^1.66.1",
  "tsup": "^7.2.0",
  "tsx": "^3.12.7",
  "typescript": "^4.8.4",
  "unified": "^11.0.2",
  "unist-util-visit": "^5.0.0",
  "vitest": "^0.34.1"
},
"dependencies": {
  "@babel/core": "^7.22.11",
  "@babel/helper-plugin-utils": "^7.22.5",
  "@babel/preset-react": "^7.22.5",
  "@babel/traverse": "^7.22.11",
  "@loadable/component": "^5.15.3",
  "@mdx-js/rollup": "2.1.3",
  "@vitejs/plugin-react": "2.2.0",
  "acorn": "^8.10.0",
  "assert": "^2.0.0",
  "cac": "^6.7.14",
  "compression": "^1.7.4",
  "enquirer": "^2.4.1",
  "esbuild": "^0.19.2",
  "fast-glob": "^3.3.1",
  "fs-extra": "^11.1.1",
  "github-slugger": "^2.0.0",
  "hast-util-from-html": "^2.0.1",
  "lodash-es": "^4.17.21",
  "mdast-util-mdxjs-esm": "^2.0.1",
  "polka": "^0.5.2",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-helmet-async": "1.3.0",
  "react-router-dom": "6.4.2",
  "rehype-autolink-headings": "^6.1.1",
  "rehype-slug": "^5.1.0",
  "remark-frontmatter": "^4.0.1",
  "remark-gfm": "^3.0.1",
  "remark-mdx": "^2.3.0",
  "remark-mdx-frontmatter": "^3.0.0",
  "remark-stringify": "^10.0.3",
  "resolve": "^1.22.4",
  "shiki": "^0.14.3",
  "sirv": "^2.0.3",
  "unocss": "^0.55.3",
  "vite": "3.1.4"
}
```
