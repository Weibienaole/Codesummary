import { combineReducers } from 'redux-immutable'

import { reducer as coreReducer } from '@/views/core/store'

const reducer = combineReducers({
	core: coreReducer
})

export default reducer
