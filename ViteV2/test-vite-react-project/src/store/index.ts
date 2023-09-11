import {
	legacy_createStore as createStore,
	applyMiddleware,
	compose
} from 'redux'
import thunk from 'redux-thunk'

import reducer from './store'

// 浏览器插件使用
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

export default store
