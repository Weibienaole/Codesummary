import React, { useState, useEffect, useContext } from "react";

function Box() {
  return (
    <div>
      <h2>Proxy</h2>
      <span>
        Proxy 起到拦截的效果，修改某些默认行为,等同于在语言层面做出修改
      </span>
      <h2>Promise/Interator(遍历器)/for...of/async&await/Generator</h2>
      <PromiseBox></PromiseBox>
      <InteratorBox></InteratorBox>
      <GeneratorBox></GeneratorBox>
      <AsyncAwaitBox></AsyncAwaitBox>
    </div>
  );
}
function PromiseBox() {
  /*
    所谓Promise 就是一个容器，里面保存着未来才会结束的事件（通常是一个异步操作），有三种操作pending(进行中)、fulfilled(成功)、rejected(失败)，只有异步操作才能决定当前是哪一种状态，任何其他操作都无法改变这个状态。

    一旦状态改变，就不会在改变，任何时候都可以拿到这个结果，Promise状态发生改变只有两种结果，pending改变为fulfilled，pendine改变为rejected，只要状态改变，就会凝固，不会再发生改变，这是就是resolve(已定型)，如果状态已经发生了，在对Promise添加回调函数，就会立即得到结果，这与事件(Event)完全不同，事件一旦错过，再去监听是不会拿到结果的

    缺点： Promise一旦新建就会立即执行，无法中途取消
          如果不在Promise内部设置回调函数， Promise内部抛出的错误不会被反应到外部
          在pending状态时，无法得知目前进展到哪个阶段(刚刚开始还是即将完成)
  
    Promise接受一个函数作为参数，这个函数有两个参数，分别为resolve(成功)、reject(失败) 它们是两个函数，由JavaScript引擎提供，不需要自己部署

    reolve作用是将Promise由 未完成 改变为 成功
    reject作用是由Promise由 未完成 改变为 失败

    Promise实例生成后，可以用 then分别指定 resolve 和 reject 状态的回调函数

    Promise.then(function(value){
        // reslove
    },function(error){
      // reject
    })

    then 接受两个函数为参数，第一个参数状态为reslove是调用，第二个为状态为rejected时调用，
    第二个参数时可选的，不是必需的，这两个函数都接受Promise对象传出的值作为参数
    这个等同于
      Promise.then(function(value){

      }).catch(function(error){

      })

    Promise 内部的错误不会影响后面的代码
  */
  function timeout(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms, "done");
    });
  }
  timeout(1000).then(value => {
    // value -> 1s error false
  });

  let promise = new Promise(function(resolve, reject) {
    // console.log("Promise Go");
    resolve();
  });
  promise
    .then(function() {
      // console.log("reslove log");
    })
    .catch(err => {
      // console.log("error");
    })
    .finally(fin => {
      // finaily() 不管Promise最后状态什么样子都会执行
      // console.log("finaily");
    });

  const p1 = new Promise((resolve, reject) => {
    resolve("hello");
  })
    .then(result => result)
    .catch(e => e);

  const p2 = new Promise((resolve, reject) => {
    throw new Error("报错了");
  })
    .then(result => result)
    .catch(e => e);
  // Promise.all([p1, p2])
  //   .then(result => console.log(result))
  //   .catch(e => console.log("err"));

  return null;
}

function InteratorBox() {
  /*
      Interator 是一种接口，为各种不同的数据结构提供统一的访问机制，任何数据结构只要部署Interator接口就可以进行遍历操作
      
      作用：
        为各种数据结构提供一种统一简便的访问接口
        使得数据结构能按某种顺序排列
        ES6新出现一种遍历方式 for...of 主要为其服务
    
    */

  // for...in   for...of

  // for...in 是为对象的遍历方式
  // for...of 是为数组的遍历方式
  return null;
}

function GeneratorBox() {
  /*
    形式上，Generator 是一个普通函数，但有两个特征，一个是函数名之间有一个星号*，二是函数体内部使用yield 定义不同的内部状态
  
  */
  function* generatorGo() {
    let i = 123;
    yield i;
    yield "yield Two";
    return "return One";
  }
  let n = generatorGo();
  console.log(n.next());
  return null;
}

function AsyncAwaitBox() {
  // await 即异步等待
  function shaizi() {
    return new Promise((resolve, reject) => {
      let suiji = parseInt(Math.random() * 6 + 1);
      setTimeout(() => {
        resolve(suiji);
      }, 1000);
    });
  }
  async function see() {
    let n = await shaizi();
    // console.log(n)
  }
  see();
  /*
    saync  表示函数里由异步操作，await表示紧跟在后面的表达式需要等待结果
    async 返回一个Promise对象
    async 函数返回值会成为then方法回调函数的参数
 
    async function a(){
      return 'hello'
    }
    a().then(v => console.log(v)) // hello


    async函数调用不会造成代码的堵塞，但await会在async函数内部造成堵塞
    await 后面的代码如果报reject，就会中断async函数的执行
    如果想要避免，就得使用 try...catch 代码块包裹await，对报reject的错误进行处理

    try {
      await ...
      await ...

    } catch (error){
      报错在此处进行处理
    }
  */

  function sleep(interval) {
    return new Promise(resolve => {
      setTimeout(resolve, interval);
    });
  }

  // 用法
  async function one2FiveInAsync() {
    for (let i = 1; i <= 5; i++) {
      console.log(i);
      await sleep(1000);
    }
  }
  // one2FiveInAsync();

  // 任何一个async函数内部出现了reject状态，那么整个async函数就会终端执行
  // 如果出现reject状态却不想中断执行的话，可以在await后面的Promise对象再跟一个catch()，来解决可能出现的报错

  //  await后面的异步操作报错 === async后面的Promise对象报reject


  // 链式调用 & promise &async/await
  function say(name) {
    return new Promise((resolve, rejece) => {
      setTimeout(() => {
        resolve(name);
      }, 1000);
    });
  }
  // promise
  say("Arthas")
    .then(res => {
      console.log(`hai ${res}`);
      return say("Monica");
    })
    .then(response => {
      console.log(`hai ${response}`);
      return say("阿萨斯");
    })
    .then(r => {
      console.log(`hai ${r}`);
    });
// async
    async function asyA(name){
      let say1 = await say(name)
      console.log(`hello ${say1}`)
      let say2 = await say('Monica')
      console.log(`hello ${say2}`)
      let say3 = await say('阿萨斯')
      console.log(`hello ${say3}`)

    }
    // asyA('Arthas')

/*
    promise与async的区别

      async相比promise更加语义化，更好分辨，代码更加简化，更加符合编程习惯
*/

  return null;
}

export default Box;
