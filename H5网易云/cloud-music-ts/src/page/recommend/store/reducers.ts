import { fromJS } from "immutable";
import * as actionCreators from './actionCreators'
import * as types from './constant'

const defaultState = fromJS({
  banner: [],
  recommendList: []
})

interface IState {
  banner: object[],
  recommendList: object[],
}

const reducer = (state: any = defaultState, action) => {
  switch(action.type){
    case types.CHANGE_BANNER: 
     return state.set('banner', action.data)
     
  }
}

export default reducer