# 地址

[npm](https://www.npmjs.com/package/@tinymce/tinymce-react)\
[github](https://github.com/tinymce/tinymce)\
[官网](https://www.tiny.cloud/my-account/dashboard/)\
[文档](https://www.tiny.cloud/docs)

# 开始

- 本文采用 tinymceV5 版本
- 仅针对 react 的步骤

## 总览

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ec17390d1924038971f32ca4783aff2~tplv-k3u1fbpfcp-watermark.image?)

## 注册

_首先需要去[官网](https://www.tiny.cloud/my-account/dashboard/)进行账号注册，然后获取到 api key(必须)，随后设置`域名`_\
_`域名`默认仅有 localhost，发布到线上需要手动添加允许的域名_

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49428a7720ab468296a66830db87c53f~tplv-k3u1fbpfcp-watermark.image?)

这些都添加完毕之后，即开始安装

## 安装

```
yarn add @tinymce/tinymce-react@3.14.0 -S
```

```javascript
import { Editor } from '@tinymce/tinymce-react'

const tinyKey = 'your key'

<Editor apiKey={tinyKey} />
```

- 也支持 cdn 引入，本文暂不赘述

# 使用

- 这里讲一些比较重要的参数

```javascript
<Editor
  apiKey={tinyKey}
  initialValue={""}
  onInit={init}
  id="Editor-Component_Container_TinyEditor"
  // inline={true}
  scriptLoading={{ async: true }} // 异步加载
  init={{
    min_height: 500,
    language: "zh_CN",
    menubar: false, // 顶部菜单栏
    resize: false, // 右下角调整大小
    statusbar: false, // 底部状态栏
    object_resizing: false, // 禁止设置媒体大小
    images_upload_handler: imagesUploadHandler,
    content_style:
      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
    default_link_target: "_blank",
    plugins: "image autolink link lists", // 部分功能需要先用插件声明
    toolbar: [
      "formatselect | fontsizeselect | bold italic strikethrough forecolor backcolor |",
      "undo redo | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | image | link |",
    ],
  }}
  onDirty={onDirty}
></Editor>
```

1. apiKey--必填，为官方账户内提供的 apikey
2. initialValue--初始显示内容
3. id--编辑器 id
4. inline--编辑器格式转换为内联\
   编辑器有三种展现形式：

- default 默认 使用 iframe 形式展示内容，标准模式
- inline 内联模式 失焦时红框内容不显示，仅显示文本框，聚焦时展示,且可以控制内部样式不像默认模式中使用 iframe,操作框在 document.body 下，以定位形式出现

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae0c51cb9bd540eca6843f9b732c74ec~tplv-k3u1fbpfcp-watermark.image?)

- Distraction-free 清爽模式 大概就是不显示栏，选中文字时出现按钮，按钮可自定义
  ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ae377c14d9c460587784a9f8c951d7f~tplv-k3u1fbpfcp-watermark.image?)

6. scriptLoading--用于配置为加载 TinyMCE 而创建的脚本标记\
   提供三个配置：
   async-是否异步 default:false
   defer-是否在脚本上设置延迟标记(就是 script 的 defer 属性) default:false
   delay-延时加载 default:0
7. init--初始化时的设置内容\
   7.1 min_height--最小高度\
   7.2 language--语言包\
   可以根据 language_url 覆盖默认地址\
   7.3 menubar--顶部菜单栏 boolean string 可以控制是否显示及指定顺序

```
menubar: 'file edit insert view format'
```

7.4 resize--右下角调整大小(textarea 的右下角按钮)\
7.5 statusbar--底部状态栏 状态栏包括元素路径、字数和编辑器大小调整\
7.6 object_resizing--打开/关闭图像、表格或媒体对象上的大小调整手柄 默认开启 可设置 boolean/img(仅打开 img)\
7.7 images_upload_handler--自定义图片上传函数\
内置四个参数 图片的各种格式，成功回调，失败回调，进度条回调(0-100)\
7.8 content_style--设置基本样式，默认模式下注入到 iframe 的 body.style 中\
7.9 default_link_target--toolbar 中 link 的默认设置\
7.10 plugins--插件\
有些功能(菜单栏，工具栏)需要现在 plugins 中注册，才可以使用\
插件分为 官方插件 和 开源插件 基本上够用，有很多功能\
[插件地址](https://www.tiny.cloud/docs/plugins/)
根据内容进行简单的配置即可使用\
7.11 toolbar--工具栏\
[toolbar 可能存在的功能](https://www.tiny.cloud/docs/advanced/available-toolbar-buttons/)\
部分功能需要在 plugins 中注册，分别 string 和 array 两者格式\
string 为一行展示，小按钮中每一个按钮由 空格 间隔，每一个块由 | 进行间隔\
array 为多行展示，每行为一个 string，格式如上 依次排列即\
8. 事件\
[事件集](https://www.tiny.cloud/docs/integrations/react/#usingthetinymcereactcomponentasacontrolledcomponent)\
8.1 onInit-初始化完成后触发 一般在内部使用 useRef 保存编辑器实例，由于是异步，所以得等待 init 完成之后再进行下一步操作\
8.2 onDirty-当编辑器内内容被修改后，会处于 脏状态 可以根据此值在 save 时判断是否处于 脏状态 是则说明编辑器内容被修改，即保存，保存成功之后调用 tinyEditorRef.current.setDirty(false) 将编辑器内的状态改为正常，就可以进行下一次保存了

更多：

- [移动端使用](https://www.tiny.cloud/docs/mobile/)
- [配置项总览](https://www.tiny.cloud/docs/configure/integration-and-setup/)
- 如果编辑器为受控组件，一般用于代码编辑器，左右视图更新，这样可能会导致性能问题，因为每一次更新都会转换一次字符串(节流)，一般由 onEditorChange 事件和 value 配合进行实时展示。\
  非受控组件的话，就是由 onDirty 配合进行保存以及展示
