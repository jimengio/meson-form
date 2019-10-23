import ReactDOM from "react-dom";
import React from "react";

import { parseRoutePath } from "@jimengio/ruled-router";

import { routerRules } from "./models/router-rules";

import Container from "./pages/container";

import "antd/dist/antd.css";
import "./main.css";
import { mesonUseEn } from "../src/lingual";
import { GenRouterTypeMain } from "controller/generated-router";

const renderApp = () => {
  let routerTree = parseRoutePath(window.location.hash.slice(1), routerRules) as GenRouterTypeMain;

  ReactDOM.render(<Container router={routerTree} />, document.querySelector(".app"));
};

window.onload = renderApp;

window.addEventListener("hashchange", () => {
  renderApp();
});

declare var module: any;

if (module.hot) {
  module.hot.accept(["./pages/container"], () => {
    renderApp();
  });
}
