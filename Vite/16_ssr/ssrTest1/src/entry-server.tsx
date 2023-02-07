import './index.css'
import App from "./App";

// 导出ssr组件入口
function ServerEntry(props: any) {
  return (
    <App data={props.data} />
  )
}

// 模拟请求数据
async function fetchData(){
  return {
    Arthas: 1
  }
}

export { ServerEntry, fetchData }