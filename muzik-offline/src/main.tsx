import React from "react";
import ReactDOM from "react-dom/client";
import "@styles/constants/base.scss";
import { App } from "@App/index";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
