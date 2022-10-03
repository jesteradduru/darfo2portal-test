/*
  This file is where the main react component (App.js) is mounted into the root element.
*/
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
// style css
import "./Assets/styles/style.css";
// import redux package
import { Provider } from "react-redux";
import store from "./App/store";
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorkerRegistration.register()
reportWebVitals();
