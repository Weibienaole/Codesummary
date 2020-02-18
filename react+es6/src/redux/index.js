import { createStore } from "redux";
import todoApp from "./reducers";
import {
  addTodo,
  VisibilityFilters,
  setVisibilityFilter,
  toggleTodo
} from "./actions";
const store = createStore(todoApp);
export default store;

// console.log(store.getState())

const unSubscribe = store.subscribe(() => {
  // console.log(store.getState());
});

store.dispatch(addTodo("Learn about actions"));
store.dispatch(toggleTodo(0));
store.dispatch(setVisibilityFilter('SHOW_COMPLETED'));
store.dispatch({type:'ADD_TODO', text:'第二次'});
store.dispatch({type:'TOGGLE_TODO', index:1});
store.dispatch(setVisibilityFilter('SHOW_ACTIVE'));

unSubscribe();
