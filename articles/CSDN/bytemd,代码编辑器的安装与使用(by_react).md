## 说明

_bytemd 这个编辑器是字节跳动的掘金团队所使用的编辑器，今天碰巧读到了一篇解析的文章，奈何水平有限看不明白，但厉害是真的(笑)，所以自己简单上手安装使用了一手，在此做做记录。_
Ps: 相关地址都在文末。

## 安装

安装相关内容：
主要 bytemd(核心) @bytemd/react(react 所需要使用的插件)
插件

- @bytemd/plugin-gfm (支持 GFM(自动链接文字,删除线,表,任务列
  表))
- @bytemd/plugin-gemoji(支持 Gemoji 短代码)
- @bytemd/plugin-highlight-ssr(高亮代码块(与 SSR 兼容))
- @bytemd/plugin-medium-zoom(像媒体中一样缩放图像)
- remark-gemoji (不安装会报错，@bytemd/plugin-gemoj 插件中有使用，不使用这个插件的话可以不安装)

## 使用

```javascript
// 编辑 / 视图
import { Editor, Viewer } from "@bytemd/react";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import gemoji from "@bytemd/plugin-gemoji";
// 引入中文包
import zhHans from "bytemd/lib/locales/zh_Hans.json";

// 引入基础css
import "bytemd/dist/index.min.css";
// 引入高亮css
import "highlight.js/styles/vs.css";

const plugins = [gfm(), gemoji(), highlight(), mediumZoom()];

function Page({ children }) {
  const [value, setValue] = useState("");
  return (
    <div className="page-wrap">
      <Editor
        // 语言
        locale={zhHans}
        // 内部的值
        value={value}
        // 插件
        plugins={plugins}
        // 动态修改值
        onChange={(v) => setValue(v)}
      />
    </div>
  );
}
```

## 遇到的一些问题

- gemoji 插件内部 有一个引入文件 gemoji/name-to-emoji 此文件为 .json 文件，如果 webpack 没有做 json 相关的尾缀匹配的话会报错，得自己加
  ![问题截图](https://img-blog.csdnimg.cn/20210611160902408.png)
- 部分选择按钮没有中译 待处理
- 删除线功能的 class 加到 编辑 模块了(无关紧要，看着别扭-。=)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210611162032812.png)

最后实现结果是非常接近掘金编辑器效果的，只是样式有所改动，修改了一些 bug。

最终视图
![图片](https://img-blog.csdnimg.cn/20210611162417850.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDIwNTYwNQ==,size_16,color_FFFFFF,t_70)

## Ps

目前只是初次的个人尝试，还没用应用到项目中，所以可能会有所欠缺，若有遗漏还请提醒一番 🤔

## 地址

_npm: https://www.npmjs.com/package/bytemd_
_github: https://github.com/bytedance/bytemd_
_解析文章地址: https://mp.weixin.qq.com/s/LGrT3k3EKyvd_7FLFXAxhg_
