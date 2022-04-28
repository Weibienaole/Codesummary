import Route from './router'
import { ErrorBoundary } from 'zzy-javascript-devtools'
import { Provider } from 'react-redux';

import { GlobalStyle } from './style';
import { IconStyle } from './assets/iconfont/iconfont'
import store from './store';

const App = () => {
  return (
    <ErrorBoundary mode={process.env.NODE_ENV}>
      <Provider store={store}>
        <GlobalStyle />
        <IconStyle />
        <Route />
      </Provider>
    </ErrorBoundary>
  );
}
export default App;
