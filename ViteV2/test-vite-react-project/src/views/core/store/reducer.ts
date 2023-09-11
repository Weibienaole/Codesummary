import { getCookies } from '@/utils/storage'
import { SET_THEME_KEY } from './constants'
import { fromJS } from 'immutable'

interface iActionProps {
	type: string
	data: unknown
}

const defaultState = fromJS({
	themeKey: getCookies('themeKey', 0)
})

const reducer = (state = defaultState, action: iActionProps) => {
	switch (action.type) {
		case SET_THEME_KEY:
			return state.set('themeKey', action.data)
		default:
			return state
	}
}
export default reducer
