# js

## Vue

### antd-vue Transfer 组件内使用自定义数据(exmaple 是表格)的文档描述中 x1 和 x3 的描述是不一样的

x1+

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb4a832d83f64565a7f404fece8f1f2b~tplv-k3u1fbpfcp-watermark.image?)

x3+

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9dfc40cc11e4b91bc2c819a273938ca~tplv-k3u1fbpfcp-watermark.image?)

## React

### antd Form 自定义组件参数的传递

这个不算 bug，只是一个 example，感觉官方文档上的有点复杂，这里简单的实现展示一次。

[官方文档](https://ant.design/components/form-cn/#components-form-demo-customized-form-controls)

简单的例子：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/298f492d6ca94a5f85e8818edde42efc~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a99110e57704b718837a54295346df3~tplv-k3u1fbpfcp-watermark.image?)

在 Form.item 内添加的自定义组件，props 中会受到两个参数，一个为当前的 name，一个为 onChange 方法。\
方法可以通过 `trigger` 属性进行变化，props 中会新增一个额外的 value 值，原先的 onChange 方法也不会消失。\
调用这个方法，即向 form 内传递此参数，form 内即可收到
