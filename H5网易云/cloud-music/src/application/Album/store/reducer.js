
import { CHANGE_ALBUM_LIST, CHANGE_ENTER_LOADING } from "./contants"
import { fromJS } from "immutable"

const defaultState = fromJS({
  albumList: {},
  enterLoading: false,
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_ALBUM_LIST:
      return state.set('albumList', action.data)
    case CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    default:
      return state
  }
}

export default reducer
