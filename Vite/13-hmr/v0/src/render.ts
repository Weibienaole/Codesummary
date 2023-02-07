import './style.css'

export const render = () => {
  const app = document.querySelector<HTMLDivElement>('#app')!
  app.innerHTML = `
    <h1>Hello Vite!</h1>
    <p target="_blank">This is hmr stest.123</p>
  `
}

// 接受自身模块更新
if(import.meta.hot){
  import.meta.hot.accept(mod => mod.render())
}