import React, { useState, useEffect, useContext } from "react";

function Box() {
  return (
    <div>
      <h2>Symbol\Set\Map</h2>
      <SymbolBox></SymbolBox>
      <SetBox></SetBox>
      <MapBox></MapBox>
    </div>
  );
}
function SymbolBox() {
  // Symbol 生成一个全局唯一的值

  /*
    Symbol 是ES6引入的新的原始数据类型 表示独一无二的值，是JavaScript的第七种数据类型
      分别是
        undefined null boolean Object Array String Symbol
  */
  let a = Symbol("asd");
  // a -> Symbol(asd)
  let b = {
    toString() {
      return "asd";
    }
  };
  // Symbol(b) -> Symbol(asd)  调用了该对象的 toString() 方法

  // Symbol 函数的参数只是表示对当前Symbol值的描述，因此相同参数的Symbol函数的返回值是不相等的
  let c = Symbol(),
    d = Symbol();
  // c === d -> false
  let e = Symbol("aaa");
  let f = Symbol("aaa");
  // e === f -> false

  // Symbol值不能与其他类型的值进行计算，会报错
  // 'your Symbol' + f  -> error

  // Symbol 可以转化为字符串、Boolean值 其余不行
  // Boolean(f) -> true   !f -> false
  // f.toString() -> 'Symbol(aaa)'

  // Symbol.proptotype.description  -> [Symbol].description
  // 返回一个Symbol的描述
  // f.description -> aaas

  // 大概解释： https://zhuanlan.zhihu.com/p/22652486
  return null;
}
function SetBox() {
  // Set();
  // 类似数组，但所有成员都是唯一的，没有重复的值
  let a = new Set();
  let b = [2, 3, 4, 5, 4, 3, 2];
  b.forEach(x => a.add(x));
  // ...a -> 2,3,4,5  不会添加重复的值
  // Set可以接受一个数组作为参数，用来初始化
  let c = new Set([1, 2, 3, 3, 1, 2]);
  // ...c -> 1,2,3

  // 衍生作用
  // 数组去重 [...new Set(array)]
  // 去掉重复字符串 [...new Set('asdasdasd')].join('') -> 'asd'

  //  ** 两个对象总是不相等的

  // Set() 属性：
  // size -> 返回Set实例的成员总数
  // c.size -> 3

  // Set 实例方法:
  // add(value) 添加某个值，返回set结构本身
  // c.add(5) -> [1,2,3,5]

  // delete(value) 删除某个值，返回Boolean表示删除成功与否
  // c.delete(5) -> true   此时c [1,2,3]

  // has(value) 返回一个Boolean 表示value是否为Set成员
  // c.has(1) -> true

  // clear() 清除所有成员，没有返回值

  // Array.from 可以将Set结构转换为数组

  let d = new Set([1, 2, 3, 4, 5, 5]);
  Array.from(d); // [1,2,3,4,5]

  // 数组去重另一种方法
  let e = [1, 2, 3, 4, 4, 3, 2, 1];
  Array.from(new Set(e)); // [1,2,3,4]

  /*
    Set() 遍历方式   keys()  values()  entries() forEach()
    由于Set()结构没有键名，只有键值（或者说键名和键值是同一个值），所欲keys() 和 values() 方法的行为完全一致

    entrise() 方法返回的数组包括键名和键值，所以每输出一次，两个成员都完全相同
    
    Set() 默认可遍历，所以可以省略values() 直接使用for...of 
    let set = new Set([1,2,3])
      for(let i of set){
        i -> 1  2  3
      }

    forEach() 遍历
    set.forEach((item,index)=>console.log(item, index))    1 1   2 2   3 3
  */

  /*
      map&filter
      let set = new Set([1,2,3,4])
      
      set = new Set([...set].map(x=>x*2))  ->  {2,4,6,8}

      set = new Set([...set].filter(x => (x % 2) === 0))  ->  {2,4}

  */

  // 如果想在遍历操作中，同步改变原来的 Set 结构，目前没有直接的方法，但有两种变通方法。一种是利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构；另一种是利用Array.from方法

  return null;
}

function MapBox() {
  // 数据结构Map
  let f = new Map();
  f.set("o", "context");
  f.get("o"); // context

  // size  返回Map结构的成员总数
  let mapa = new Map();
  mapa.set("a", "aaa");
  mapa.set("b", "bbb");
  // mapa.size  ->  2

  // set
  //  f.set(key, value)
  // 设置键名key对应的值为value，然后返回整个Map()结构，如果key有值，则更新键值，否则新增该键

  // get
  // f.get('a') -> aaa
  // 读取key对应的键值，如果找不到返回undefined

  // has 返回一个Boolean  表示这个键是否在当前Map当中

  // delete 删除某个键，返回Boolean，表示成功失败与否

  // clear 清除所有成员

  // Map 遍历   keys() values() entries() forEach()

  // 都可以使用 ... 来简化遍历

  const mapb = new Map([
    [1, "a"],
    [2, "b"]
  ]);

  // [...mapb.keys()]  -> [1,2]
  // [...mapb.values()]  -> ['a', 'b']
  // [...mapb.entries()]  -> [[1,'a'], [2, 'b']]

  // 由于Map 没有map、filter方法，所以需要 ... 转换成数组 再进行Map数据的遍历与筛选
  let mapc = new Map([...mapb].filter(([k, v]) => k > 1)); // {2 => "b"}
  let mapd = new Map([...mapb].map(([i, o]) => [i * 2, o])); // {2 => "a", 4 => "b"}

  // Map 还有一个forEach方法，与数组的forEach方法类似，也可以实现遍历

  // Map转数组   [...mapb]
  // 数组转Map   new Map([Array])
  // Map转对象
  function mapObj(map) {
    let obj = Object.create(null);
    for (let [k, v] of map) {
      obj[k] = v;
    }
    return obj;
  }
  mapObj(mapd); // {2: "a", 4: "b"}

  // 对象转Map
  let obj = { 2: "a", 4: "b" };
  function objMap(obj) {
    let map = new Map();
    for (let i in obj) {
      map.set(i, obj[i]);
    }
    return map;
  }
  objMap(obj); //  {"2" => "a", "4" => "b"}

  return null;
}
export default Box;
