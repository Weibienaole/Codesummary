import App from "./App";
import './index.css'

export function ServerEntry(props: any) {
  return (
    <App/>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function fetchFn(){
  return {user: 'Arthas'}
}