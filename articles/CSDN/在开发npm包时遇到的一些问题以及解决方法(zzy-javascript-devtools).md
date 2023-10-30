# 当前文章停止更新！ [最新地址](https://juejin.cn/post/7084038983990116365/)

# 目录文件

```
## command 命令文件
## lib -- 转义生成的代码
## node_modules
## src -- 源代码
## .gitignore
## index.js -- 入口文件
## package.json
## readme.md
```

## 命令步骤

分解(parsing) -> 转译(babel) -> 压缩(minfiles)

## React 转化为 ES5 代码(包含所有 ES6 转化为 ES5 代码)

核心是利用 babel 的一组预设 @babel/preset-react 来对 react 进行转化，随后再使用 @babel/env 来进行 ES6 - ES5 的转化

### 1._npm 包内安装 babel 相关依赖_

```javascript
{
  "devDependencies": {
    "@babel/preset-react": "^7.13.13",
    "@babel/cli": "^7.13.14",
    "@babel/core": "^7.13.15",
    "@babel/polyfill": "^7.12.1",
    "@babel/preset-env": "^7.13.15",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
  },
}

```

### 2. _配置 bebel 文件(babel7 -> babel.config.json)_

babel 文件的读取顺序是由下往上的

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ],
    ["@babel/preset-react"]
  ]
}
```

### 3. 使用 babel 命令进行转译

```
 ./node_modules/.bin/babel src --copy-files --out-dir lib --presets=@babel/env,@babel/preset-react
```

_src - 转译 src 目录内的文件
–out-dir - 表示编译的类型是文件
--copy-files - 拷贝一份不进行编译的文件到目标文件夹
--presets=@babel/env - 添加预设(@babel/env,@babel/preset-react)_

### 注意项

暂无。

###### 这样就完成了对 React 文件和所有 ES6 的转化！

参考链接:
[babel 官网](https://www.babeljs.cn/docs/usage)
[如何使用 ES6 編写一个 React 模块,并且编译后发布到 NPM](http://react-china.org/t/es6-react-npm/3879)

## 利用 fs + UglifyJS 完成对 .js 文件的压缩与混淆

### 核心就是利用 fs 模块获取文件列表，递归获取文件信息并存储，然后在原来的架子上写入 .min.js 文件，最后再将 .js 文件删除

- _原来的架子是指在进行 babel 转化的时候已经将目录搭好，我们只需要将新文件按原路径写入即可，省去了自己主动去创建文件夹的操作_

废话不多说，直接上完整代码，搭配注释便能理解。

```javascript
let fs = require("fs");
let UglifyJS = require("uglify-js");

// .css 文件手动压缩
function iGetInnerText(testStr) {
  var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
  resultStr = testStr.replace(/[ ]/g, ""); //去掉空格
  resultStr = testStr.replace(/[\r\n]/g, ""); //去掉回车换行
  return resultStr;
}

// 递归对每个文件进行写入
function writefs(obj, toPath, pPath = toPath) {
  for (let i in obj) {
    if (!fs.lstatSync(`${pPath + "/"}${i}`).isDirectory()) {
      let tPath = pPath.replace(toPath, toPath);
      fs.writeFile(
        `${tPath}/${obj[i].toFileName}`,
        obj[i].code,
        "utf-8",
        function (err) {
          if (err) throw err;
          console.log("success");
          if (i.indexOf(".js") > 0 || i.indexOf(".less") > 0) {
            // 写入完成删除源文件
            fs.unlinkSync(`${tPath}/${i}`);
          }
        }
      );
    } else writefs(obj[i], toPath, `${pPath + "/"}${i}`);
  }
}

// 递归拿到所有文件，并重命名、获取文件信息
function getAllFiles(pathTo, obj = {}) {
  // 读取当前文件夹
  let nowLevelFiles = fs.readdirSync(pathTo);
  nowLevelFiles.forEach((i) => {
    // 判断是否是文件夹
    if (!fs.lstatSync(`${pathTo}/${i}`).isDirectory()) {
      let newI = i.replace(".js", ".min.js");
      // 拿到文件内容
      let fileContent = fs.readFileSync(`${pathTo}/${i}`, "utf-8"),
        fileType = i.split(".")[1];
      obj[i] = {
        form: `${pathTo}/${i}`,
        toFileName: newI,
        // 如果是 .js 文件，利用 UglifyJS 进行压缩，混淆，如果不是则利用正则消除空格
        code:
          fileType === "js"
            ? UglifyJS.minify({ [i]: fileContent }).code
            : iGetInnerText(fileContent),
      };
    } else obj[i] = getAllFiles(`${pathTo}/${i}`, {});
  });
  return obj;
}

let Uglify = function (toPath) {
  writefs(getAllFiles(toPath), toPath);
};

Uglify("./lib");
```

##### 4-21

优化了一下 uglify.js ，将命令文件归拢一处，更加简洁

新增**getFiles.js**

```javascript
let fs = require("fs");
module.exports = function getFiles(path) {
  let files = [];
  getAllFiles(path);
  // 递归拿到所有文件，并重命名、获取文件信息
  function getAllFiles(path) {
    // 读取当前文件夹
    let nowLevelFiles = fs.readdirSync(path);
    nowLevelFiles.forEach((i) => {
      // 判断是否是文件夹
      if (!fs.lstatSync(`${path}/${i}`).isDirectory()) {
        files.push({ fileName: i, path: `${path}/${i}`, parentPath: path });
      } else getAllFiles(`${path}/${i}`, {});
    });
  }
  return files;
};
```

优化 **uglify.js**
_简单来说就是将递归获取所有文件的步骤摘了出去，作为一个功能函数来使用，更加符合 “美感”(?)。然后就是多了一个筛选，可以选择不进行压缩的文件。_

```javascript
let fs = require("fs");
let UglifyJS = require("uglify-js");
let getFiles = require("./getFiles");
const noCompress = ["JSBriged.js"]; // 不需要压缩的文件名称

// .css 文件手动压缩
function iGetInnerText(testStr) {
  var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
  resultStr = testStr.replace(/[ ]/g, ""); //去掉空格
  resultStr = testStr.replace(/[\r\n]/g, ""); //去掉回车换行
  return resultStr;
}

// 对每个文件进行写入
function writefs(obj, toPath, pPath = toPath) {
  let allFiles = getFiles(toPath);

  for (let i in obj) {
    fs.writeFile(obj[i].newPath, obj[i].code, "utf-8", function (err) {
      if (err) throw err;
      console.log("success");
      if (i.indexOf(".js") > 0 || i.indexOf(".less") > 0) {
        // 写入完成删除源文件
        fs.unlinkSync(obj[i].form);
      }
    });
  }
}

// 拿到所有文件，并重命名、获取文件信息
function setFiles(pathTo) {
  let allFiles = getFiles(pathTo);
  let obj = {};
  allFiles.map((item, index) => {
    // 排除
    if (noCompress.indexOf(item.fileName) !== -1) return;
    let newI = item.fileName.replace(".js", ".min.js");
    // 拿到文件内容
    let fileContent = fs.readFileSync(item.path, "utf-8"),
      fileType = item.fileName.split(".")[1];
    obj[item.fileName] = {
      form: item.path,
      toFileName: newI,
      newPath: `${item.parentPath}/${newI}`,
      // 如果是 .js 文件，利用 UglifyJS 进行压缩，混淆，如果不是则利用正则消除空格
      code:
        fileType === "js"
          ? UglifyJS.minify({ [item.fileName]: fileContent }).code
          : iGetInnerText(fileContent),
    };
  });
  return obj;
}

let Uglify = function (toPath) {
  writefs(setFiles(toPath), toPath);
};

Uglify("./lib");
```

## 5-31 -- 按需加载

_前几天实现了按需加载，今天记录一下实现方式_

### step1: 更改所有文件内的导出方式

**_递归导入所有模块。由于第二步需要利用 fs 进行操作，所以导出需要 node 识别，也就是使用 commonJS 导入导出 (module.exports = {导出的模块})_**

### step2: 分离(parsing)

**_所有模块引入之后，利用 递归 + fs 模块 将每个方法(fn)循环生成到文件夹(原文件名)内部，每个方法额外拼接 export default，中途记录每个文件的名称及路径，在生成完毕之后动态生成 index.js ，利用模版字符串动态将每个文件以 ES6 形式导入导出_**

**由于 react 组件的特殊性(.jsx 内部引入 react(主要原因) ) 不参与分割，本身进行开发的时候就以模块形式开发，不聚一起。 所以在这里直接跳过分割，只进行文件拷贝(copyFiles)**

```javascript
// parsing.js
const fs = require("fs");
const path = require("path");
const getFiles = require("./getFiles");
const copyFiles = require("./copyFiles");

/*
  导入主文件
  获取所有导出值
  利用fs遍历生成新文件
  新建一个外部index，将所有遍历生成的文件引入其中 动态模版生成
*/

// index.js 到目标 文件的路径

class Parsing {
  // originPath - 源路径    targetPath - 目标路径   mainPath - 入口文件路径
  constructor(originPath, targetPath, mainPath) {
    this.path = originPath;
    this.fileDetail = {}; // 文件路径数据存储
    this.storePath = "./lib/"; // 最终文件存储路径
    this.resolvePath = targetPath;
    this.indexPath = mainPath;
  }
  init() {
    try {
      fs.mkdirSync(this.resolvePath);
    } catch {}
    // react component 拷贝一份到目标文件夹，不参与分割
    copyFiles(this.path, this.resolvePath, "ReactComponents");

    // 拿到所有目标目录及自文件路径集合
    let files = getFiles(this.path);
    // 排除 不是 .js 后缀形式文件    排除 react component  另外处理
    files = files.filter((item) => {
      let parentN = item.parentPath.split("/");
      return (
        path.extname(item.fileName) === ".js" &&
        parentN[parentN.length - 1] !== "ReactComponents"
      );
    });
    // 拿到当前文件夹下的所有文件  目前仅一层，若优化使用递归
    for (let file of files) {
      // 获取文件内的所有导出
      let fileExportFnList = require(file.path);
      let dirName = file.fileName.split(".")[0];
      // 写入文件夹
      try {
        fs.mkdirSync(`${this.resolvePath}/${dirName}`);
      } catch {}
      // 遍历生成新文件
      this.mkFile(fileExportFnList, dirName);
    }
    this.createIndex();
  }
  // 遍历生成新文件
  mkFile(fileExportFnList, dirName) {
    let dirDatas = [];
    for (let i in fileExportFnList) {
      let exportFn = fileExportFnList[i];
      dirDatas.push({
        path: `${this.storePath}${dirName}/${i}.js`,
        name: i,
      });
      let filePath = `${this.resolvePath}/${dirName}/${i}.js`;
      fs.writeFileSync(filePath, "export default " + exportFn, "utf-8");
    }
    // 记录每一个文件内所有导出模块(新文件)的路径及模块名称
    this.fileDetail[dirName] = dirDatas;
  }
  //自动生成index.js
  createIndex() {
    let contentData = "";
    let exportCon = "";
    let fileD = this.fileDetail;
    let RCFiles = getFiles(`${this.resolvePath}/ReactComponents`);
    // 筛选出后缀仅为 .jsx 的文件 且对后缀进行替换并将格式与 fileDetail 同步
    RCFiles = RCFiles.filter((i) => path.extname(i.fileName) === ".jsx").map(
      (j) => {
        return {
          path: `${this.storePath}${j.path
            .split("separate")[1]
            .replace(".jsx", ".js")}`,
          name: j.fileName.split(".jsx")[0],
        };
      }
    );
    fileD = { ...fileD, ReactComponents: RCFiles };
    let dirNames = "";
    // 合并统一处理入口文件的导入
    for (let dir in fileD) {
      let names = "";
      dirNames += dir + ", ";
      let files = fileD[dir];
      for (let i = 0; i < files.length; i++) {
        let { name, path } = files[i];
        names += name + ", ";
        contentData += `
import ${name} from '${path}'

`;
      }
      // 版本向下兼容，将一个文件中的所有模块包裹一起，键名为文件名称
      contentData += `
let ${dir} = { ${names.slice(0, names.length - 2)} }

`;
      exportCon += names;
    }
    // 删除额外 ,  号
    exportCon = exportCon.slice(0, exportCon.length - 2);
    dirNames = dirNames.slice(0, dirNames.length - 2);
    let finallyData = `
${contentData}

export { ${exportCon}, ${dirNames} }

`;
    // 合并后写入
    fs.writeFileSync(this.indexPath, finallyData, "utf-8");
  }
}

const parsing = new Parsing(
  path.resolve(__dirname, "../src"),
  path.resolve(__dirname, "../separate"),
  path.resolve(__dirname, "../index.js")
);

parsing.init();
```

### step3 babel 转化

_这个点主要注意的是在 babel 转化时需要将转化模块更改为 ES6 导入导出(默认 commonJS)_

babel.config.json

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false // 更改为 ES6导入导出
      }
    ],
    ["@babel/preset-react"]
  ]
}
```

### step4 uglify 压缩

和之前一样，不贴代码了

### 小结

之所以将第一、第三步分开，主要还是 node 不识别 ES6 导入导出，所以只能自己以 cmooonJS 形式去导出，然后在拆分时再前设 export default，这样便符合了 treeshaking 的前置要求

如果有问题还请评论区留言，或 Q: 884823636 联系本人。
