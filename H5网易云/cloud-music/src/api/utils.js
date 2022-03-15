// 获取数目
export const getCount = (n) => {
  if (n < 0) return 0
  if (n < 10000) {
    return n
  } else if (Math.floor(n / 10000) < 10000) {
    return Math.floor(n / 1000) / 10 + '万'
  } else {
    return Math.floor(n / 10000000) / 10 + "亿";
  }
}

// 防抖
export const debounce = (fn, delay) => {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      clearTimeout(timer)
    }, delay);
  }
}

// rank 筛选歌单
export const filterIndex = (list) => {
  let idx = 0
  for (let i = 0; i < list.length - 1; i++) {
    if (list[i].tracks.length && !list[i + 1].tracks.length) {
      idx = i + 1
    }
  }
  return idx
}

// 拼接歌手
export const getName = (list) => {
  let str = ''
  for (let i in list) {
    str += (i === '0' ? list[i].name : '/' + list[i].name)
  }
  return str
}

// 判断对象是否为空
export const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;

// js中添加的css不会有process处理(浏览器兼容),需要自行处理
const elementStyle = document.createElement('div').style

const vendor = (() => {
  // 通过transition确认浏览器
  const transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransfrom",
    ms: "msTransform",
    standard: "Transform"
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export const prefixStyle = style => {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

// 拼接歌曲地址
export const getSongUrl = id => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

// 换算歌曲时长
export const formatPlayTime = t => {
  t = t | 0
  const m = (t / 60) | 0
  const s = (t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// 根据歌曲对象找到在其列表的下标
export const findIndex = (song, list) => {
  return list.findIndex(item => item.id === song.id)
}

// 随机模式
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export const shuffle = list => {
  let newArr = []
  newArr = [...list]
  for(let i = 0; i < newArr.length; i++){
    let j = getRandomInt(0, i)
    let t = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = t
  }
  return newArr

}