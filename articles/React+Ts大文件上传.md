---
theme: github
highlight: monokai
---

# 整体逻辑

**_核心为切片上传，利用 input 打开文件后的 File 文件可以使用 slice 方法，将大文件按指定大小拆分为多个小块，然后遍历上传至服务端，当全部切片传输完毕之后，服务端合并文件并上传库/云_**

Ps:ts 类型声明还不太熟悉，所以有些类型声明可能难以理解甚至愚蠢，还请谅解。

```tsx
import axios from "axios";
import * as React from "react";

export default class Counter extends React.PureComponent<void> {
  public render() {
    const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
      const target = e.target as HTMLInputElement;
      const file: File = (target.files as FileList)[0];
      start(file);
    };
    const start = (file: File): void => {
      // 设置基准地址
      axios.defaults.baseURL = "http://localhost:8888";
      // 进行切片
      const files: object[] = []; // 文件列表
      const size: number = 1024 * 50; // 切片大小 50kb
      let index: number = 0; // 切片序号
      for (let cur: number = 0; cur < file.size; cur += size) {
        files.push({
          chunk: file.slice(cur, cur + size),
          hash: index++,
        });
      }

      const fileUploadFn = async (list: object[] = []) => {
        // 列表为空，切片上传结束
        if (list.length === 0) {
          // 进行合并操作
          await axios({
            method: "post",
            params: {
              filename: file.name,
            },
            url: "/merge",
          });
          console.log("done");
          return;
        }
        // 设置进程池最大值
        const max: 3 = 3;
        // 进程池
        const pool: object[] = [];
        // 完成数量
        let finish: number = 0;
        // 上传失败文件列表
        const failList: object[] = [];

        let item: any;
        for (item of list) {
          const formData: FormData = new FormData();
          formData.append("filename", file.name);
          formData.append("hash", item.hash);
          formData.append("chunk", item.chunk);
          // 遍历上传切片
          const task: Promise<object> = axios({
            method: "post",
            url: "/upload",
            data: formData,
          });
          task
            .then((): void => {
              console.log("then");
            })
            .catch((): void => {
              console.log("catch");
              // 将上传失败的切片放入失败组
              failList.push(item);
            })
            .finally((): any => {
              // 每次请求结束数量+1
              finish++;
              // 找到当次请求的切片，进程池内移除
              const idx: number = pool.findIndex(
                (t: Promise<object>): boolean => t === task
              );
              pool.splice(idx, 1);
              // 当本次列表切片全部上传(不管成功失败)且失败组长度不为 0
              if (finish === list.length && finish !== 0) {
                console.log("failList!");
                // 重新上传失败的切片
                return fileUploadFn(failList);
              }
            });
          // Promise之后push到进程池中
          pool.push(task);
          // 当进程池满额，需要等待进程池中的任意切片上传之后才可以继续操作
          if (pool.length === max) {
            await Promise.race(pool);
          }
        }
        // }
      };
      // 执行
      fileUploadFn(files);
    };
    return (
      <div>
        <input type="file" onChange={(e) => uploadFile(e)} />
        <button className="uploadBtn">上传</button>
      </div>
    );
  }
}
```

```js
// 接口文件 server.js

const express = require("express");
// 处理 formData 格式的插件
const multiparty = require("multiparty");
const fs = require("fs");
const path = require("path");
// https://www.runoob.com/nodejs/nodejs-buffer.html
const { Buffer } = require("buffer");

// 最终路径
const STATIC_FILES = path.join(__dirname, "./file");
// 临时路径
const STATIC_TEMP = path.join(__dirname, "./temp");

const server = express();
// 静态文件托管
server.use(express.static(path.join(__dirname, "./dist")));

// 切片上传的接口
server.post("/upload", (req, res) => {
  // 防止跨域
  res.header("Access-Control-Allow-Origin", "*");
  const form = new multiparty.Form();
  // 解析formData
  form.parse(req, (err, fields, files) => {
    // 拿到传输数据
    let filename = fields.filename[0];
    let hash = fields.hash[0];
    let chunk = files.chunk[0];
    let dir = `${STATIC_TEMP}/${filename}`;

    try {
      // 没有这个文件夹就创建一个
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const buffer = fs.readFileSync(chunk.path);
      // createWriteStream --- https://www.jianshu.com/p/0806008d175d
      const ws = fs.createWriteStream(`${dir}/${+hash}`);
      ws.write(buffer);
      ws.close();
      res.send(`${filename}-${hash}上传成功！`);
    } catch (err) {
      // console.log(err, 'upload post catch')
      res.status(500).send(`${filename}-${hash} 切片上传失败`);
    }
  });
});

server.post("/merge", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { filename } = req.query;
  try {
    let len = 0;
    const bufferList = fs
      .readdirSync(`${STATIC_TEMP}/${filename}`)
      .map((hash, index) => {
        const buf = fs.readFileSync(`${STATIC_TEMP}/${filename}/${index}`);
        // 将长度进行累加
        len += buf.length;
        return buf;
      });
    // buffer.concat -- https://www.cnblogs.com/lalalagq/p/9908505.html
    const bufferFile = Buffer.concat(bufferList, len);
    const ws = fs.createWriteStream(`${STATIC_FILES}/${filename}`);
    ws.write(bufferFile);
    ws.close();
    res.send("合并成功！");
  } catch (err) {
    // console.error(err, 'upload post catch')
    res.status(500).send(`${filename} 合并失败`);
  }
});

server.listen(8888);
```
