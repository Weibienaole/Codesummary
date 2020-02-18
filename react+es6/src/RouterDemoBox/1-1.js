import React from "react";
import { Link, BrowserRouter, Route } from "react-router-dom";
import One from "./one";
// import Two from './two'

// function RouterBox(){
//   return(
//     <div>
//       <div>
//         go where?
//         <Link to='/RouterBox/one'>Go one</Link>
//         {/* <Link to='/two'>Go two</Link> */}
//       </div>
//       <div>
//         {/* <Route exact path='/one' component={One} /> */}
//         {/* <Route path='/two' component={Two} /> */}
//       </div>
//       {/* <BrowserRouter > */}
//         {/* <Route path='/RouterBox/one' component={One} /> */}
//         {/* <Route path='/RouterBox/two' component={Two} /> */}
//       {/* </BrowserRouter > */}
//     </div>
//   )
// }
class RouterBox extends React.Component {
  render() {
    return (
      <div>
        <div>
          go where?
          <Link to="/RouterBox/one">Go one</Link>
          {/* <Link to='/two'>Go two</Link> */}
        </div>
        <div>
          {/* <Route exact path='/one' component={One} /> */}
          {/* <Route path='/two' component={Two} /> */}
        </div>
        {/* <BrowserRouter > */}
        {/* <Route path='/RouterBox/one' component={One} /> */}
        {/* <Route path='/RouterBox/two' component={Two} /> */}
        {/* </BrowserRouter > */}
      </div>
    );
  }
}
// function One(){
//   return(
//     <div>
//       one
//     </div>
//   )
// }
function Two() {
  return <div>Two</div>;
}
export default RouterBox;
