import React from "react";
import {
  HashRouter,
  Route,
  Router,
  Switch,
  BrowserRouter
} from "react-router-dom";

import { IndexRoute } from "react-router";
// model
import App from "./app/App";
import Comment from "./testBox/testDemo";
import Inputs from "./inputs/index";
import StoreBox from "./storeBox/index";
import ContextDemo from "./contextDemo/index";
import RefsBox from "./refsBox/index";
import RefsDemo from "./refsBox/demo2";
import HOCBox from "./HOCBox/index";
import Hook from "./Hook/index";
import HookDemo from "./Hook/demo";
import Todolist from "./todolist/index";
import TodolistHook from "./todolist/hook";
import ES6 from "./ES6/index";
import ES6demo1 from "./ES6/demo1";
import ES6demo2 from "./ES6/demo2";
import ES6demo3 from "./ES6/demo3";
import ES6demo4 from "./ES6/demo4";
import RouterBox from "./RouterDemoBox/1-1";
import RouterBoxOne from "./RouterDemoBox/one";

// const Routers = () => (
// <HashRouter>
//   <Switch>
//     <Route exact path="/" component={App} />
//     <Route exact path="/Inputs" component={Inputs} />
//     <Route exact path="/Comment" component={Comment} />
//     <Route exact path="/StoreBox" component={StoreBox} />
//     <Route exact path="/ContextDemo" component={ContextDemo} />
//     <Route exact path="/refs/index" component={RefsBox} />
//     <Route exact path="/refs/demo" component={RefsDemo} />
//     <Route exact path="/HOCBox" component={HOCBox} />
//     <Route exact path="/Hook" component={Hook} />
//     <Route exact path="/Hook/demo" component={HookDemo} />
//     <Route exact path="/todolist" component={Todolist} />
//     <Route exact path="/todolist/hook" component={TodolistHook} />
//     <Route exact path="/ES6/index" component={ES6} />
//     <Route exact path="/ES6/demo1" component={ES6demo1} />
//     <Route exact path="/ES6/demo2" component={ES6demo2} />
//     <Route exact path="/ES6/demo3" component={ES6demo3} />
//     <Route exact path="/ES6/demo4" component={ES6demo4} />
//     {/* <Route
//       path="/layoutBox"
//       component={
//         <Father>
//           <Route path="/layoutBox/children" component={Children} />
//         </Father>
//       }
//     /> */}
//     {/* /exact代表绝对匹配，只有绝对匹配from里面的地址的时候才会重定向到to的页面,使用场景：一般俩个Route组件的path有包含关系的时候，就会在短的这个path上加exact */}
//   </Switch>
// </HashRouter>

// );

class Routers extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/Inputs" component={Inputs} />
          <Route exact path="/Comment" component={Comment} />
          <Route exact path="/StoreBox" component={StoreBox} />
          <Route exact path="/ContextDemo" component={ContextDemo} />
          <Route exact path="/refs/index" component={RefsBox} />
          <Route exact path="/refs/demo" component={RefsDemo} />
          <Route exact path="/HOCBox" component={HOCBox} />
          <Route exact path="/Hook" component={Hook} />
          <Route exact path="/Hook/demo" component={HookDemo} />
          <Route exact path="/todolist" component={Todolist} />
          <Route exact path="/todolist/hook" component={TodolistHook} />
          <Route exact path="/ES6/index" component={ES6} />
          <Route exact path="/ES6/demo1" component={ES6demo1} />
          <Route exact path="/ES6/demo2" component={ES6demo2} />
          <Route exact path="/ES6/demo3" component={ES6demo3} />
          <Route exact path="/ES6/demo4" component={ES6demo4} />
          <Route
            exact
            path="/RouterBox"
            render={() => (
              <div>
                <Route path="/RouterBox" component={RouterBox} />
                <Route path="/RouterBox/one" component={RouterBoxOne} />
              </div>
            )}
          />
          {/* <Route
        path="/layoutBox"
        component={
          <Father>
            <Route path="/layoutBox/children" component={Children} />
          </Father>
        }
      /> */}
          {/* /exact代表绝对匹配，只有绝对匹配from里面的地址的时候才会重定向到to的页面,使用场景：一般俩个Route组件的path有包含关系的时候，就会在短的这个path上加exact */}
        </Switch>
      </BrowserRouter>
    );
  }
}

// <BrowserRouter
// basename=string  所有位置的基准Url  /mainLayout/...
// forceRefresh: bool    如果 为true 导航的过程中页面将会刷新，一般情况之后不支持HTML5 history API的浏览器中使用
// getUserConfirmation: function    用于确认导航的函数 默认使用 window.confirm    例如，当从 /a 导航至 /b 时，会使用默认的 confirm 函数弹出一个提示，用户点击确定后才进行导航，否则不做任何处理。译注：需要配合 <Prompt> 一起使用。
/**
         * 
  const getConfirmation = (message, callback) => {
  const allowTransition = window.confirm(message);
  callback(allowTransition);
}

<BrowserRouter getUserConfirmation={getConfirmation} />
         */
// keyLength: number  location.key 的长度，默认为6
// >
// <Father />
// </BrowserRouter>

// import {
//   BrowserRouter as Router, //使用as相当于重命名，如果需要从浏览器路由改成HasRouter只需要在这里把BrowserRouter改成HasRouter就可以了，其他地方还是使用Router包着不需要改变
//   Switch, //和js里面的switch语法差不多，这个是用来判断路由地址
//   Route, //用来路由的
//   Redirect //重定向，用来判断用户输入的地址是否满足条件，不满足就重定向到xxx页面
// } from "react-router-dom";

export default Routers;
