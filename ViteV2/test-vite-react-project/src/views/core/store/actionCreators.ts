import { fromJS } from 'immutable'
import { SET_THEME_KEY } from './constants'

const setThemeKey = (list) => ({
	type: SET_THEME_KEY,
	data: fromJS(list)
})

// 从权限表中获取到最新的导航栏
export const setThemeKeyDis = (key) => {
	return (dispatch, getState) => {
		// 只是示例
		const themeKey = getState().getIn(['core', 'themeKey'])
		console.log('old', themeKey)

		dispatch(setThemeKey(key))
	}
}
