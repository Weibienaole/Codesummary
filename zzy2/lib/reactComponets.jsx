import {devtools} from 'zzy-javascript-devtools'
/*
  props
    getMoreData Function 加载更多
*/

// 无限滚动触发块，直接链接触发事件即可
// 需要在触发事件内结束时 赋值 devtools.infinityScrollIng.bol = true

export function ScrollLoadingBar({ getMoreData }) {
  let [a, setA] = useState()
  useEffect(() => {
    let that = this
    devtools.infinityScrollIng(
      document.querySelector('.scrollLoadingBar'),
      () => {
        devtools.infinityScrollIng.bol = false
        getMoreData()
      }
    )
    return () => devtools.infinityScrollIng.closeMonitor()
  }, [])
  // return (
  //   <div
  //     className="scrollLoadingBar"
  //     style={{ opacity: 0, width: 0, height: 0, zIndex: -1 }}
  //   ></div>
  // )
}