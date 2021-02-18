import React from "react";
import ReactDOM from "react-dom";
import Router from "./Router";
import store from "./redux/index";
import { Provider } from "react-redux";
import "./index.css";
ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById("root")
);
