import React from "react";
import ReactDOM from "react-dom";
import Authentication from "./components/Authentication";
import Dashboard from "./components/Dashboard/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <Authentication />
    {/* <Dashboard /> */}
  </React.StrictMode>,
  document.getElementById("root")
);
