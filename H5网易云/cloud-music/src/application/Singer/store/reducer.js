import { fromJS } from "immutable";
import { CHANGE_SINGER_SONGS_LIST, CHANGE_ENTER_LOADING, CHANGE_ARTIST } from './constants'

const defaultState = fromJS({
  singerSongsList: [],
  enterLoading: false,
  artist: {},
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_SINGER_SONGS_LIST:
      return state.set('singerSongsList', action.data)
    case CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    case CHANGE_ARTIST:
      return state.set('artist', action.data)
    default:
      return state
  }
}

export default reducer