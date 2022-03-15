import { combineReducers } from 'redux-immutable'

import { reducer as recommendReducer } from '../application/Recommend/store'
import { reducer as singerReducer } from '../application/Singers/store'
import { reducer as rankReducer } from '../application/Rank/store'
import { reducer as albumReducer } from '../application/Album/store'
import { reducer as SingerReducer } from '../application/Singer/store'
import { reducer as PlayerReducer }  from '../application/Player/store'

const reducer = combineReducers({
  recommend: recommendReducer,
  singers: singerReducer,
  rank: rankReducer,
  album: albumReducer,
  singer: SingerReducer,
  player: PlayerReducer
})

export default reducer