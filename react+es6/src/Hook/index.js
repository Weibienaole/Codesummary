import React, { Component, useState, useEffect, useReducer } from "react";
// class HOCBox extends Component {
//   constructor(props) {
//     super(props);

//   }
//   render() {
//    const [count, setCount] = useState(0)
//     return (
//       <>
//         <a href="/">back App</a>
//         <p>You clicked { count } times</p>
//         <button onClick={()=> setCount(count + 1)}>
//           Click me
//         </button>
//       </>
//     );
//   }
// }
function HookBox() {
  const [count, setCount] = useState(0);
  useEffect(()=>{
    document.title = `You clicked ${count} Times`
    fun()
  })
  function fun() {
    console.log(123)
  }
  return (
    <>
    <a href="/">back App</a>
        <a href="/Hook/demo">go demo</a>
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(8)}>Click me</button>
      </div>
    </>
  );
}

const btnNum = {count: 0}

function reducer(state, action){
  console.log(state)
  switch(action.type){
    case 'jian':
      return {count: state.count - 1}
    case 'jia':
      return {count: state.count + 1}
    default:
      return alert('error')
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, btnNum)
  return(
    <>
      Count: {state.count}
      <button onClick={()=> dispatch({type: 'jian'})}> - </button>
      <button onClick={()=> dispatch({type: 'jia'})}> + </button>
    </>
  )
}

export default HookBox;
