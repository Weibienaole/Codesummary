import { render } from './render';
import { initState } from './state';

render();
initState();

// 接受自身依赖模块的更新  第一个参数改为监听依赖的路径，第二个为监听到的回调
if(import.meta.hot){
  import.meta.hot.accept('./render.ts', (mod) => mod.render())
}

// 接受自身多个子模块的更新
if(import.meta.hot){
  import.meta.hot.accept(['./render.ts', './state.ts'], (mods) => {
    const [renderModule, stateModule] = mods
    if(renderModule){
      renderModule.render()
    }
    if(stateModule){
      stateModule.initState()
    }
  })
}