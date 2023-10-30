#### **_本文章记录本次从 webpack4 框架升级为 webpack5 之后衍生出来的所有更改_**

##### **_框架主体为 zzy-project-cli (地址在文末) 此项目为自行开发构建，包含原 webpack4 版本 和升级后的 webpack5 版本_**

##### 框架技术栈为 react、react-router、HOOK、react-redux(已安装，未使用)、antd-mobile(UI 框架)、less

##### 但本次升级和 react 几乎没关系，所以理论上也可以用到 vue 项目中来，进行一个参考

##### 此次升级的做法是升级不兼容插件，删除可替代插件，保留现有兼容 webpack5 插件，不将全部插件升级

##### 目前作者初测是没有问题的(首先排除 ie10/11)，可以拿来进行项目开发

## 插件相关改动

### node.js

webpack5 所支持 node.js 的最低版本为 **10.13.0**
小于这个版本的话，选择 webpack4，或者升级 node.js

```javascript
// package.json

"engines": {
  "node": ">=10.13.0"
}
```

### 部分插件版本更新/新增/移除表

#### 此部分只说明插件的变动，部分详情下文展示

##### 插件更新/新增都会加上当前使用版本，避免最新插件兼容报错

更新
**webpack** 5 系列版本的话我们选择当下较新且比较热门的版本
**webpack-cli** 保持不变 (3.3.12)
**webpack-dev-server** 改动较大，详情在下文会有说明
**html-webpack-plugin** 升级到较新版本，避免兼容问题
**webpack-marge** 升级到较新版本，避免兼容问题

新增
**css-minimizer-webpack-plugin** (css 压缩相关)
**friendly-errors-webpack-plugin** (控制台相关)
**portfinder** (端口相关)

移除
**optimize-css-assets-webpack-plugin** 废弃 详情下文说明
**url-loader, file-loader** 废弃 详情下文说明
**postcss-safe-parser** 废弃
**clean-webpack-plugin** 废弃

```
// 更新
yarn add webpack@5.51.1 webpack-dev-server@4.0.0 html-webpack-plugin@5.3.2 webpack-marge@5.8.0 -D

// 新增
yarn add css-minimizer-webpack-plugin@3.0.2 friendly-errors-webpack-plugin@1.7.0 portfinder@1.0.28 -D

// 移除
yarn remove url-loader file-loader optimize-css-assets-webpack-plugin postcss-safe-parser clean-webpack-plugin -D
```

### 废弃类

### optimize-css-assets-webpack-plugin

_webpack5 有了更好的选择 css-minimizer-webpack-plugin_

移除之前 optimize-css-assets-webpack-plugin 插件的相关代码
新增如下

```javascript
// webpack.prod.js
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
optimization: {
  minimizer: [
    new CssMinimizerWebpackPlugin({
      parallel: true,
      minimizerOptions: {
        preset: [
          "default",
          {
            // 删除注释
            discardComments: { removeAll: true },
          },
        ],
      },
    }),
  ];
}
```

### url-loader, file-loade

_webpack5 内置图片压缩处理，所以不再需要这两个 loader 来辅助打包_
_修改如下：_

```javascript
// webpack.base.js
module: {
  rules: [
    {
      // 字体文件等
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: "asset/resource",
      exclude: /node_modules/,
      parser: {
        dataUrlCondition: {
          // 超过20kb以文件形式引入，反之以base64形式引入
          maxSize: 1024 * 20,
        },
      },
      generator: {
        // 基础路径
        publicPath: "./",
        // 文件路径
        filename: "files/fonts/[name]_[hash:6].[ext]",
      },
    },
    {
      // 图片的转化
      test: /\.(jpe?g|png|gif|bmp|svg)$/i,
      type: "asset",
      include: [
        path.resolve(absolutePath, "src"),
        path.resolve(absolutePath, "node_modules/zzy-javascript-devtools/lib"),
      ],
      parser: {
        dataUrlCondition: {
          maxSize: 1024 * 15,
        },
      },
      generator: {
        publicPath: "./",
        filename: "files/media/[name]_[hash:6].[ext]",
      },
    },
  ];
}
```

### clean-webpack-plugin

webpack5 内置清理上一次打包文件的方式，不再需要此包

```javascript
output: {
  clean: {
    keep: /static/, // 保留 'static' 下的静态资源
  }
}
```

### 更新类(新增类在内部)

### html-webpack-plugin

4 升 5 主要更新了下版本，内部修改是因为 启动服务/打包 使用了 node API 方式执行，将生产，开发环境区分了开来(而且在尝试过程中出现了一些奇奇怪怪的报错)

```javascript
const HtmlWebPackPlugin = require("html-webpack-plugin");
// 获取当前目录的绝对路径
const absolutePath = fs.realpathSync(process.cwd());

// webpack.dev.js
plugins: [
  new HtmlWebPackPlugin({
    filename: "index.html",
    template: path.resolve(absolutePath, "public/index.html"),
    hash: 6,
    inject: "body", // 在body标签下方填入标签
  }),
];

// webpack.prod.js
plugins: [
  new HtmlWebPackPlugin({
    filename: "index.html",
    template: path.resolve(absolutePath, "public/index.html"),
    hash: 6,
    inject: "body", // 在body标签下方填入标签
    // 压缩
    minify: {
      removeComments: true, //移除HTML中的注释
      collapseWhitespace: true, //删除空白符与换行符
    },
    // srcipt标签插入  auto
    chunksSortMode: "auto",
  }),
];
```

### webpack-dev-server(重点更改)

**_本次升级，使用可操作性更高的 node API 方式来进行运行项目，所以 webpack 配置中不设置 devServer，所有都在脚本文件中处理_**
_新建脚本运行文件，package.json 中执行对应文件即可_

内部插件解释：
friendly-errors-webpack-plugin 控制台显示内容插件，可以自定义显示内容
portfinder 异步获取到可用的端口

```javascript
// scripts/server.js

const WebpackDevServer = require("webpack-dev-server");
const Webpack = require("webpack");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const openBrowser = require("react-dev-utils/openBrowser");
// 不同色彩提示
const chalk = require("react-dev-utils/chalk");
const portfinder = require("portfinder");
const webpackConfigDev = require("../config/webpack.dev");
const webpackConfigProd = require("../config/webpack.prod");
const getNetworkIp = require("../config/getRunningAddress");

// 获取到当前网络 IP 地址
const ip = getNetworkIp();

const mode = process.env.NODE_ENV;

// 获取到正确的配置模块
const webpackConfig =
  mode === "development" ? webpackConfigDev : webpackConfigProd;

// 设置基础值
portfinder.basePort = 8081;

// 异步获取可用的端口
portfinder.getPort((err, port) => {
  if (err) {
    throw new Error(err);
  } else {
    // 向配置中插入此插件，运行成功之后显示想要的内容
    webpackConfig.plugins.push(
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [
            "运行成功～ ",
            "",
            `运行地址: ${chalk.cyan(`http://localhost:${port}`)}`,
            "",
            `IP地址: ${chalk.cyan(`http://${ip}:${port}`)}`,
            "",
            `当前环境: ${chalk.blue(mode)}`,
            "",
            `当前DOMAIN: ${chalk.green(process.env.DOMAIN)}`,
          ],
        },
        // 清空控制台
        clearConsole: true,
      })
    );
    process.env.PORT = port;

    const compiler = Webpack(webpackConfig);
    // devServer配置
    const devServerOptions = {
      hot: true, // 模块热加载
      open: false,
      host: "0.0.0.0",
      client: {
        // 当出现编译错误或警告时，在浏览器中显示全屏覆盖。
        overlay: false,
      },
      // 常开  gzip压缩 但只有在
      compress: true,
    };

    // 提前打开页面，然后通过热加载来拿到start之后的页面信息
    openBrowser(`http://localhost:${port}`);

    const server = new WebpackDevServer(devServerOptions, compiler);
    // 启动项目
    server.start(port, ip, (err) => {
      if (err) {
        return console.log(err);
      }
    });
  }
});
```

Ps: _我也蛮想在启动成功之后再 openBrowser ，但不知道为何，成功之后内部不显示任何消息，智能先打开，然后通过热加载更新拿到启动后的内容，偶然情况下依旧需要主动刷新，待解决_

_跑起来之后控制台如图：_
![运行成功显示](https://img-blog.csdnimg.cn/5a8526b224174ebea24cd6313973a529.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oOz5b-F5piv5rij5rij5a6H5LqG,size_16,color_FFFFFF,t_70,g_se,x_16)

## 配置改动(base)

##### 这里面的不包括上文加的配置，之后的 dev,prod 也是

1. webpack5 启动时需要设置 target: 'web' 来启动热加载

```javascript
target: 'web',
```

2. webpack5 默认打包出来的内容是 es6 格式的，是不兼容 ie11 的
   处理方式：

```javascript
output: {
  // 打包时关闭箭头函数
  environment: {
    arrowFunction: false
  },
},
// 转换为数组，新增 es5 来支持ie11，但当前形态下热更新会失效，解决方法下文会说明
target: ['web', 'es5'],
```

3. 使用 oneOf，每个文件只过一次判断

```javascript
module:{
	rules:[
		// 使用oneOf包裹
		oneOf:[
			// ...some code
		]
	]
}
```

4. 配置 publicPath，ie10/11 不支持自动匹配 publicPath(**暂废弃，生产环境打包会造成文件丢失，谨慎使用**)

```javascript
output:{
	publicPath: '/', // ./ 会找不到文件
}
```

## 配置改动(dev)

```javascript
// webpack.dev.js
output: {
  // 不输出路径信息
  pathinfo: false
},
// devtools更改，容量变大的同时报错会获得更多的信息
devtool: 'source-map',
stats: {
  // 只在发生错误时输出
  preset: 'errors-only'
},
// 在第一个错误出现时抛出失败结果,终止打包
bail: true,
optimization: {
  splitChunks: {
    chunks: 'all'
  },
  moduleIds: 'named', // NamedModulesPlugin模块 迁移
  // webpack编译出错跳过报错阶段,在编译结束后报错
  //  NoEmitOnErrorsPlugin模块迁移
  emitOnErrors: true
}
```

## 配置改动(prod)

**_terser-webpack-plugin_** 插件在 5 中舍弃了部分参数，更新如下

```javascript
// webpack.prod.js
const TerserWebpackPlugin = require("terser-webpack-plugin");

new TerserWebpackPlugin({
  exclude: /node_modules/,
  terserOptions: {
    // 是否将注释剥离到单独的文件中
    extractComments: false,
    // 开启并行压缩
    parallel: true,
    // 开启缓存
    cache: true,
  },
});
```

**_splitChunks_**也是如此，5 里面舍弃了很多东西

```javascript
// webpack.prod.js
optimization: {
  minimize: true, // 开启压缩
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      // 第三方依赖
      vendor: {
        name: 'vendor',
        chunks: 'initial',
        test: /[\\/]node_modules[\\/]/,
        minSize: 1024, // 小于1kb的文件不进行拆分
        maxSize: 100 * 1024, // 大于100kb的文件尝试拆分为小文件
        // 拆分前必须共享模块的最小 chunks 数
        minChunks: 2,
        priority: 10, // 权重
      },
      // 缓存组
      commons: {
        test: /[\\/]src[\\/]/,
        name: 'commons',
        chunks: 'all',
        minSize: 1024,
        minChunks: 2,
        // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
        reuseExistingChunk: true,
      },
      default: {
        minChunks: 2,
        priority: -20,
        minSize: 1024,
        reuseExistingChunk: true,
        // 函数方式对chunk进行命名
        name(module, chunks, cacheGroupKey) {
          const moduleFileName = module
            .identifier()
            .split('/')
            .reduceRight((item) => item);
          return `${cacheGroupKey}_${moduleFileName}`;
        },
      }
    },
  },
  // 避免文件的频繁变更导致浏览器缓存失效，所以其是更好的利用缓存。提升用户体验。
  runtimeChunk: {
    name: 'manifest'
  }
},
```

其他

```javascript
// webpack.prod.js
stats: {
  // 当统计信息配置没被定义，则该值是一个回退值。它的优先级比本地的 webpack 默认值高。
  all: false,
  // 是否展示错误
  errors: true,
  // 展示依赖和告警/错误的来源
  moduleTrace: true,
  // 添加 错误 信息
  logging: 'error',
},
```

## build 打包

_同样使用 nodeAPI 形式执行，和运行类似_

```javascript
// scripts/build.js

const Webpack = require("webpack");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const chalk = require("react-dev-utils/chalk");
const webpackConfigDev = require("../config/webpack.dev");
const webpackConfigProd = require("../config/webpack.prod");

const mode = process.env.NODE_ENV;

const webpackConfig =
  mode === "development" ? webpackConfigDev : webpackConfigProd;

// 设置打包后输出内容
const logConfig = {
  all: false,
  builtAt: true,
  outputPath: true,
  warnings: true,
  errors: true,
};

webpackConfig.plugins.push(
  new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: [
        "打包成功～ ",
        `当前环境: ${chalk.green(mode)}`,
        `当前DOMAIN: ${chalk.blue(process.env.DOMAIN)}`,
      ],
    },
    clearConsole: true,
  })
);

webpackConfig.target = ["web", "es5"];

const compiler = Webpack(webpackConfig);

// 进行打包
compiler.run(function (err, status) {
  if (err) {
    console.error(err);
  }
  let { builtAt, outputPath, warnings, errors } = status.toJson(logConfig);
  // 成功后进行资源展示
  // 包大小查看的端口(8888)是webpack-bundle-analyzer插件默认输出的端口号
  console.log(
    `
    创建时间：${chalk.green(getTime(builtAt))}
    输出地址：${chalk.cyan(outputPath)}
    包大小查看：${chalk.magenta(
      mode === "production" ? "http://127.0.0.1:8888" : "开发环境不支持此项"
    )}
    警告：${chalk.yellow(JSON.stringify(warnings))}
    报错：${chalk.red(JSON.stringify(errors))}
    `
  );
});

function add0(m) {
  return m < 10 ? "0" + m : m;
}
function getTime(time) {
  var time = new Date(time);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y +
    "-" +
    add0(m) +
    "-" +
    add0(d) +
    " " +
    add0(h) +
    ":" +
    add0(mm) +
    ":" +
    add0(s)
  );
}
```

Ps: _本来在打包完成之后我想显示一下包大小，但从 assets 里面拿到的值是不包括 map 文件的，所以是有出入的，还不如直接在 webpack-bundle-analyzer 插件上查看来的直观_
打包后控制台显示
![控制台显示](https://img-blog.csdnimg.cn/146ce07377314433b48bd93f8bcf74d4.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oOz5b-F5piv5rij5rij5a6H5LqG,size_20,color_FFFFFF,t_70,g_se,x_16)

## 项目目录结构

![项目目录](https://img-blog.csdnimg.cn/a487e3f3df5a4d83a39d0411b4dd1e74.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oOz5b-F5piv5rij5rij5a6H5LqG,size_12,color_FFFFFF,t_70,g_se,x_16)

## 主要更改配置文件代码

### package.json

```
{
  "name": "self_frame-webpack5",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "private": true,
  "homepage": ".",
  "scripts": {
    "start": "cross-env NODE_ENV=development DOMAIN=domain node ./scripts/server.js",
    "start:prod": "cross-env NODE_ENV=production DOMAIN=domain node ./scripts/server.js",
    "start:prod-s": "cross-env NODE_ENV=production DOMAIN=domain node ./scripts/server.js",
    "build": "cross-env NODE_ENV=development DOMAIN=domain node ./scripts/build.js",
    "build:prod": "cross-env NODE_ENV=production DOMAIN=domain node ./scripts/build.js",
    "build:prod-s": "cross-env NODE_ENV=production DOMAIN=domain node ./scripts/build.js",
    "dll": "npx webpack --config ./config/webpack_dll.config.js"
  },
  "devDependencies": {
    "@babel/core": "^7.14.0",
    "@babel/plugin-proposal-decorators": "^7.14.2",
    "@babel/plugin-proposal-export-default-from": "^7.12.13",
    "@babel/plugin-transform-runtime": "^7.14.2",
    "@babel/preset-env": "^7.14.1",
    "@babel/preset-react": "^7.13.13",
    "@babel/runtime-corejs3": "^7.14.0",
    "add-asset-html-webpack-plugin": "^3.2.0",
    "antd-mobile": "^2.3.4",
    "autoprefixer": "9.8.6",
    "axios": "^0.21.1",
    "babel": "^6.23.0",
    "babel-loader": "^8.2.2",
    "babel-plugin-add-module-exports": "^1.0.4",
    "babel-plugin-import": "^1.13.3",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "copy-webpack-plugin": "5.1.2",
    "core-js": "^3.12.1",
    "cross-env": "^7.0.3",
    "css-loader": "^5.2.4",
    "css-minimizer-webpack-plugin": "^3.0.2",
    "eslint": "7.32.0",
    "eslint-plugin-react": "^7.25.1",
    "friendly-errors-webpack-plugin": "^1.7.0",
    "html-webpack-plugin": "5.3.2",
    "less": "3.9.0",
    "less-loader": "5.0.0",
    "mini-css-extract-plugin": "1.6.0",
    "portfinder": "^1.0.28",
    "postcss-loader": "4.0.2",
    "react": "^17.0.2",
    "react-dev-utils": "^11.0.4",
    "react-dom": "^17.0.2",
    "react-redux": "^7.2.4",
    "react-router-dom": "^5.2.0",
    "redux": "^4.1.0",
    "style-loader": "^2.0.0",
    "terser-webpack-plugin": "1.4.5",
    "thread-loader": "^3.0.4",
    "webpack": "5.51.1",
    "webpack-bundle-analyzer": "^4.4.1",
    "webpack-cli": "3.3.12",
    "webpack-dev-server": "4.0.0",
    "webpack-merge": "5.8.0",
    "zzy-javascript-devtools": "^1.4.1"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "engines": {
    "node": ">=10.13.0"
  }
}

```

### getRunningAddress(获取 ip 地址)

```javascript
const os = require("os");

function getNetworkIp() {
  let needHost = ""; // 打开的host
  try {
    // 获得网络接口列表
    let network = os.networkInterfaces();
    for (let dev in network) {
      let iface = network[dev];
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i];
        if (
          alias.family === "IPv4" &&
          alias.address !== "127.0.0.1" &&
          !alias.internal
        ) {
          needHost = alias.address;
        }
      }
    }
  } catch (e) {
    needHost = "localhost";
  }
  return needHost;
}

module.exports = getNetworkIp;
```

### webpack.base.js

```javascript
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const packageJson = require("../package.json");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// 在html中引入文件
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");

const DllPluginMethods = require("./DllPluginMethods");

const mode = process.env.NODE_ENV;
const PUBLIC_URL = packageJson.homepage;
const isProduction = mode === "production";

// 获取当前目录的绝对路径
const absolutePath = fs.realpathSync(process.cwd());

const includeOptions = {
  include: path.resolve(absolutePath, "src"),
};
const BasicsCssLoaders = [
  // 模块热更新css需要 样式以style形式存在
  isProduction ? MiniCssExtractPlugin.loader : "style-loader",
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        config: path.resolve(absolutePath, "config/postcss.config.js"),
      },
      sourceMap: false,
    },
  },
];

// 基础配置
const webpackConfig = {
  mode,
  entry: {
    index: path.resolve(absolutePath, "src/index.js"),
  },
  output: {
    filename: "./files/js/[name].[hash:6].js",
    chunkFilename: "./files/js/[name].[hash:6].js",
    path: path.resolve(absolutePath, "dist"),
    // 打包时关闭箭头函数
    environment: {
      arrowFunction: false,
    },
    // 清除上一次的打包文件
    clean: {
      keep: /static/, // 保留 'static' 下的静态资源
    },
    // publicPath: '/',
  },
  // webpack5 设置了才有热更新效果 保证ie11兼容
  // 热更新会失效
  // target: ['web', 'es5'],
  target: "web",
  resolve: {
    modules: [path.resolve(absolutePath, "node_modules"), "node_modules"],
    extensions: [".js", ".jsx"],
    alias: {
      "@": path.resolve("src"),
      _Components: "/src/components",
    },
    // 第三方包中直接采用 ES5 形式的内容
    mainFields: ["main"],
  },
  module: {
    rules: [
      {
        // 一个文件只经过一个判断
        oneOf: [
          {
            test: /\.css$/,
            include: [
              path.resolve(absolutePath, "src"),
              path.resolve(absolutePath, "node_modules/antd-mobile"),
              path.resolve(
                absolutePath,
                "node_modules/zzy-javascript-devtools"
              ),
              path.resolve(
                absolutePath,
                "node_modules/normalize.css/normalize.css"
              ),
            ],
            use: BasicsCssLoaders,
          },
          {
            test: /\.less$/,
            ...includeOptions,
            use: [...BasicsCssLoaders, "less-loader"],
          },
          {
            test: /\.(js|jsx)$/,
            use: [
              {
                loader: "thread-loader",
                options: {
                  workers: 3,
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true,
                },
              },
            ],
            ...includeOptions,
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: "asset/resource",
            exclude: /node_modules/,
            parser: {
              dataUrlCondition: {
                maxSize: 1024 * 20,
              },
            },
            generator: {
              publicPath: "./",
              filename: "files/fonts/[name]_[hash:6].[ext]",
            },
          },
          {
            // 图片的转化
            test: /\.(jpe?g|png|gif|bmp|svg)$/i,
            type: "asset",
            include: [
              path.resolve(absolutePath, "src"),
              path.resolve(
                absolutePath,
                "node_modules/zzy-javascript-devtools/lib"
              ),
            ],
            parser: {
              dataUrlCondition: {
                maxSize: 1024 * 15,
              },
            },
            generator: {
              publicPath: "./",
              filename: "files/media/[name]_[hash:6].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./files/css/main_[hash:6].css",
    }),
    // 设置全局变量
    new webpack.ProvidePlugin({
      React: "react",
      Component: ["react", "Component"],
      useState: ["react", "useState"],
      useEffect: ["react", "useEffect"],
      // default  添加默认请求
      _request: [path.resolve(absolutePath, "src/utils/request.js"), "request"],
    }),
    new InterpolateHtmlPlugin(HtmlWebPackPlugin, {
      PUBLIC_URL,
    }),
    new AddAssetHtmlWebpackPlugin([...DllPluginMethods("path")]),
    ...DllPluginMethods("plugins"),
    new CopyWebpackPlugin([
      {
        from: path.resolve(absolutePath, "public/browserIcon.svg"),
        to: "./",
      },
      {
        from: path.resolve(absolutePath, "static"),
        to: "./static",
      },
    ]),
    // 解决全局变量无法显示的异常
    new webpack.DefinePlugin({
      "process.env.DOMAIN": JSON.stringify(process.env.DOMAIN),
    }),
  ],
};

module.exports = webpackConfig;
```

### webpack.dev.js

```javascript
const path = require("path");
const fs = require("fs");
const webpackBase = require("./webpack.base");
const { merge } = require("webpack-merge");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

// 获取当前目录的绝对路径
const absolutePath = fs.realpathSync(process.cwd());

// 开发环境配置
const webpackMerge = merge(webpackBase, {
  output: {
    // 不输出路径信息
    pathinfo: false,
  },
  cache: true,
  // eval 提高编译效率
  // devtool: 'cheap-module-eval-source-map'
  // 完整展示错误信息
  devtool: "source-map",
  plugins: [
    new HtmlWebPackPlugin({
      filename: "index.html",
      template: path.resolve(absolutePath, "public/index.html"),
      hash: 6,
      inject: "body", // 在body标签下方填入标签
    }),
    // 开启webpack热更新功能
    new webpack.HotModuleReplacementPlugin(),
  ],
  // 只在发生错误时输出
  stats: {
    preset: "errors-only",
  },
  // 在第一个错误出现时抛出失败结果,终止打包
  bail: true,
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    moduleIds: "named", // NamedModulesPlugin模块 迁移
    // webpack编译出错跳过报错阶段,在编译结束后报错
    //  NoEmitOnErrorsPlugin模块迁移
    emitOnErrors: true,
  },
});

module.exports = webpackMerge;
```

### webpack.prod.js

```javascript
const path = require("path");
const fs = require("fs");
const webpackBase = require("./webpack.base");
const { merge } = require("webpack-merge");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");

// 打包完成之后打开一个页面，显示每个包大小
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// 获取当前目录的绝对路径
const absolutePath = fs.realpathSync(process.cwd());

// 生成环境配置
module.exports = merge(webpackBase, {
  // 生成一个没有列信息（column-mappings）的SourceMaps文件，同时 loader 的 sourcemap 也被简化为只包含对应行的。
  // 最快
  devtool: "cheap-module-source-map",
  /**
   * webpack中实现代码分割的两种方式：
   * 1.同步代码：只需要在webpack配置文件总做optimization的配置即可
   * 2.异步代码(import)：异步代码，无需做任何配置，会自动进行代码分割，放置到新的文件中
   */
  optimization: {
    minimize: true, // 开启压缩
    minimizer: [
      new CssMinimizerWebpackPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            "default",
            {
              // 清除注释
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      new TerserWebpackPlugin({
        exclude: /node_modules/,
        terserOptions: {
          // 是否将注释剥离到单独的文件中
          extractComments: false,
          // 开启并行压缩
          parallel: true,
          // 开启缓存
          cache: true,
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // 第三方依赖
        vendor: {
          name: "vendor",
          chunks: "initial",
          test: /[\\/]node_modules[\\/]/,
          minSize: 1024, // 小于1kb的文件不进行拆分
          maxSize: 100 * 1024, // 大于100kb的文件尝试拆分为小文件
          // 拆分前必须共享模块的最小 chunks 数
          minChunks: 2,
          priority: 10, // 权重
        },
        // 缓存组
        commons: {
          test: /[\\/]src[\\/]/,
          name: "commons",
          chunks: "all",
          minSize: 1024,
          minChunks: 2,
          // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          minSize: 1024,
          reuseExistingChunk: true,
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module
              .identifier()
              .split("/")
              .reduceRight((item) => item);
            return `${cacheGroupKey}_${moduleFileName}`;
          },
        },
      },
    },
    // 避免文件的频繁变更导致浏览器缓存失效，所以其是更好的利用缓存。提升用户体验。
    runtimeChunk: {
      name: "manifest",
    },
  },
  plugins: [
    new HtmlWebPackPlugin({
      filename: "index.html",
      template: path.resolve(absolutePath, "public/index.html"),
      hash: 6,
      inject: "body", // 在body标签下方填入标签
      // 压缩
      minify: {
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true, //删除空白符与换行符
      },
      chunksSortMode: "auto",
    }),
    new BundleAnalyzerPlugin({
      analyzerPort: 8888, // 端口号
      openAnalyzer: false,
    }),
  ],
  stats: {
    // 当统计信息配置没被定义，则该值是一个回退值。它的优先级比本地的 webpack 默认值高。
    all: false,
    // 是否展示错误
    errors: true,
    // 展示依赖和告警/错误的来源
    moduleTrace: true,
    // 添加 错误 信息
    logging: "error",
  },
});
```

### server.js

```javascript
const WebpackDevServer = require("webpack-dev-server");
const Webpack = require("webpack");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const openBrowser = require("react-dev-utils/openBrowser");
const chalk = require("react-dev-utils/chalk");
const portfinder = require("portfinder");
const webpackConfigDev = require("../config/webpack.dev");
const webpackConfigProd = require("../config/webpack.prod");
const getNetworkIp = require("../config/getRunningAddress");

const ip = getNetworkIp();

const mode = process.env.NODE_ENV;

const webpackConfig =
  mode === "development" ? webpackConfigDev : webpackConfigProd;

// 设置基础值
portfinder.basePort = 8081;

portfinder.getPort((err, port) => {
  if (err) {
    throw new Error(err);
  } else {
    webpackConfig.plugins.push(
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [
            "运行成功～ ",
            "",
            `运行地址: ${chalk.cyan(`http://localhost:${port}`)}`,
            "",
            `IP地址: ${chalk.cyan(`http://${ip}:${port}`)}`,
            "",
            `当前环境: ${chalk.blue(mode)}`,
            "",
            `当前DOMAIN: ${chalk.green(process.env.DOMAIN)}`,
          ],
        },
        clearConsole: true,
      })
    );
    process.env.PORT = port;

    const compiler = Webpack(webpackConfig);
    const devServerOptions = {
      hot: true, // 模块热加载
      open: false,
      host: "0.0.0.0",
      client: {
        overlay: false,
      },
      // 常开  gzip压缩 但只有在
      compress: true,
    };

    // 提前打开页面，然后通过热加载来拿到start之后的页面信息
    openBrowser(`http://localhost:${port}`);

    const server = new WebpackDevServer(devServerOptions, compiler);
    server.start(port, ip, (err) => {
      if (err) {
        return console.log(err);
      }
    });
  }
});
```

### build.js

```javascript
const Webpack = require("webpack");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const chalk = require("react-dev-utils/chalk");
const webpackConfigDev = require("../config/webpack.dev");
const webpackConfigProd = require("../config/webpack.prod");

const mode = process.env.NODE_ENV;

const webpackConfig =
  mode === "development" ? webpackConfigDev : webpackConfigProd;

const logConfig = {
  all: false,
  builtAt: true,
  outputPath: true,
  warnings: true,
  errors: true,
};

webpackConfig.plugins.push(
  new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: [
        "打包成功～ ",
        `当前环境: ${chalk.green(mode)}`,
        `当前DOMAIN: ${chalk.blue(process.env.DOMAIN)}`,
      ],
    },
    clearConsole: true,
  })
);

webpackConfig.target = ["web", "es5"];

const compiler = Webpack(webpackConfig);

compiler.run(function (err, status) {
  if (err) {
    console.error(err);
  }
  let { builtAt, outputPath, warnings, errors } = status.toJson(logConfig);
  console.log(
    `
    创建时间：${chalk.green(getTime(builtAt))}
    输出地址：${chalk.cyan(outputPath)}
    包大小查看：${chalk.magenta(
      mode === "production" ? "http://127.0.0.1:8888" : "开发环境不支持此项"
    )}
    警告：${chalk.yellow(JSON.stringify(warnings))}
    报错：${chalk.red(JSON.stringify(errors))}
    `
  );
});

function add0(m) {
  return m < 10 ? "0" + m : m;
}
function getTime(time) {
  //shijianchuo是整数，否则要parseInt转换
  const t = new Date(time);
  let y = t.getFullYear();
  let m = t.getMonth() + 1;
  let d = t.getDate();
  let h = t.getHours();
  let mm = t.getMinutes();
  let s = t.getSeconds();
  return (
    y +
    "-" +
    add0(m) +
    "-" +
    add0(d) +
    " " +
    add0(h) +
    ":" +
    add0(mm) +
    ":" +
    add0(s)
  );
}
```

##### 这就是目前升级的所有内容啦。简单测试了一番，除去 ie11 上的异常白屏待解决，基础使用是没有问题的，值得一提的是，webpack5 的加载速度快了很多，几乎是量级上的提升。

##### 后期不定期更新

##### 如果有错误，遗漏的地方，还请指正！

## 项目地址

#### [zzy-react-project webpack4(GitHub)](https://github.com/Weibienaole/zzy-react-project_webpack4)

#### [zzy-react-project webpack5(GitHub)](https://github.com/Weibienaole/zzy-react-project_webpack5)

## 参考地址

#### [webpack5 文档](https://webpack.docschina.org/concepts/)

# 如果转载，请标明作者、地址，谢谢。
