let timer: number | undefined

export function initState() {
  function setCount() {
    const data = import.meta.hot?.data || { count: 0 }
    data.count += 1
    return data.count
  }
  
  timer = setInterval(() => {
    let countEle = document.getElementById('count')
    countEle!.innerText = setCount() + ''
  }, 1000)
}

// 当前模块更新时触发
if (import.meta.hot) {
  // 初始化
  if (!import.meta.hot.data.count) {
    import.meta.hot.data.count = 0
  }
  import.meta.hot.dispose(() => {
    timer && clearTimeout(timer)
  })
}
