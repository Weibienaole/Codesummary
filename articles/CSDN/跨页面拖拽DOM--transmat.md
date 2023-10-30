# 亮点：跨越浏览器边界，实现数据共享

## 本文仅简述如何快速在页面内实现，若想了解原理，请前往文末的链接！

## 实现方式 react - HOOK

### _拖拽方：_

```html
// 引入 js文件
<script src="https://unpkg.com/transmat/lib/index.umd.js"></script>
```

```javascript
// jsx
// 设置 draggable="true" 表示此DOM可进行拖拽
<div
  className="draggable"
  ref={sourceRef}
  id="source"
  tabindex="0"
  draggable="true"
>
  我是可拖拽的～
</div>
```

```css
#source {
  background: #eef;
  border: solid 1px rgba(0, 0, 255, 0.2);
  border-radius: 8px;
  cursor: move;
  display: inline-block;
  margin: 1em;
  padding: 4em 5em;
}
```

```javascript
const { Transmat, addListeners } = transmat;

const sourceRef = useRef();
const [data, setData] = useState([]);
useEffect(() => {
  /*
		addListeners参数接受四个值，分别是
		 **target** - 监听的目标（进行拖拽/响应拖拽 DOM）
		 **type** - 监听类型  **'transmit' | 'receive'**   进行拖拽/响应拖拽
		 **listener** - 事件监听器
		 **options** - 配置对象  设置是否允许拖拽和复制、粘贴操作  默认 {dragDrop: 	true, copyPaste: true}
	*/
  addListeners(
    sourceRef.current,
    "transmit",
    (event) => {
      const transmat = new Transmat(event);
      transmat.setData({
        "text/plain": "i am zzy",
        "text/html": `
          <h1>i am zzy</h1>
          <p>菜狗一枚
             <a href="https://blog.csdn.net/weixin_44205605?spm=1001.2101.3001.5343">访问我的主页</a>!
          </p>
          <img src="https://profile.csdnimg.cn/1/8/0/1_weixin_44205605" border="1" />
     `,
        "text/uri-list":
          "https://blog.csdn.net/weixin_44205605?spm=1001.2101.3001.5343",
        "application/json": {
          name: "渣渣宇",
          wechat: "semlinker",
        },
      });
    },
    { dragDrop: true, copyPaste: true }
  );
}, []);
```

**setData 里面的所需要传的四个键值对，他们都是用来提供给浏览器数据的，不是必填项**

**text/plain**：表示文本文件的默认值，一个文本文件应当是人类可读的，并且不包含二进制数据。
**text/html**：表示 HTML 文件类型，一些富文本编辑器会优先从 dataTransfer 对象上获取 text/html 类型的数据，如果不存在的话，再获取 text/plain 类型的数据。
**text/uri-list**：表示 URI 链接类型，大多数浏览器都会优先读取该类型的数据，如果发现是合法的 URI 链接，则会直接打开该链接。如果不是的合法 URI 链接，对于 Chrome 浏览器来说，它会读取 text/plain 类型的数据并以该数据作为关键词进行内容检索。
**application/json**：表示 JSON 类型，个人更倾向用来传递数据

### 接收方：

```html
// 引入 js文件
<script src="https://unpkg.com/transmat/lib/index.umd.js"></script>
```

```javascript
// jsx
<div id="target" tabindex="0" ref={targetRef}>
  这里这里～
</div>
```

```css
#target {
  border: dashed 1px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  margin: 1em;
  padding: 4em;
}
.drag-active {
  background: rgba(255, 255, 0, 0.1);
}
.drag-over {
  background: rgba(255, 255, 0, 0.5);
}
```

```javascript
const { Transmat, addListeners, TransmatObserver } = transmat

const targetRef = useRef()
const [data, setData] = useState([])
useEffect(() => {
	addListeners(targetRef.current, 'receive', (event) => {
      const transmat = new Transmat(event)
      // 判断是否含有"application/json"类型的数据
      // 及事件类型是否为drop或paste事件
      if (transmat.hasType('application/json') && transmat.accept()) {
        const jsonString = transmat.getData('application/json')
        const data = JSON.parse(jsonString)
        console.log(data, jsonString)
        targetRef.current.textContent = jsonString
      }
    })
    const obs = new TransmatObserver((entries) => {
      for (const entry of entries) {
        const transmat = new Transmat(entry.event)
        if (transmat.hasType('application/json')) {
          entry.target.classList.toggle('drag-active', entry.isActive)
          entry.target.classList.toggle('drag-over', entry.isTarget)
        }
      }
    })
    obs.observe(target.current)
  }, [])
}, [])

```

原文链接：[拖拽竟然还能这样玩！](https://juejin.cn/post/6984587700951056414#heading-7)

github 地址：[transmat](https://github.com/google/transmat)
