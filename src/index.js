import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import App from "./ui/App";

import "./styles/index.scss";

ReactDOM.render(
  <BrowserRouter>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
