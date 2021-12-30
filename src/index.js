import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Cart } from "./components/Cart";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./redux";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import logo from "./assets/logo.png";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <div className="navbar is-dark mb-5">
        <div className="navbar-brand">
          <a className="navbar-item" href="https://clinkin.mx">
            <img src={logo} alt="logo" />
          </a>
        </div>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Cart />} />
          <Route path="/pago" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
