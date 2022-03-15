import { renderRoutes } from 'react-router-config'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

// 全局样式
import { GlobalStyle } from './style'
// 全局字体图片
import { IconStyle } from './assets/iconfont/iconfont'
import routes from './routes'
import store from './store/index'

import { DataProvider } from './application/Singers/CategoryType'

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle />
        <IconStyle />
        {/* useRuducer 中的provider传入数据 */}
        <DataProvider>
          {/* renderRouters 只渲染一层路由，如果有深层的需要在对应页面重新调用 */}
          {renderRoutes(routes)}
        </DataProvider>
      </HashRouter>
    </Provider>
  )
}

export default App
