import { render } from './render';
import { initState } from './state';

render();
initState();


if(import.meta.hot){
  import.meta.hot.accept('./render.ts', (mod) => {
    mod.render()
  })
}