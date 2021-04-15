import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {Inject, ScheduleComponent, Week, Month} from '@syncfusion/ej2-react-schedule'

import App from "./App";
// import * as serviceWorker from "./serviceWorker";
// import Scheduler from "./components/scheduler";
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// serviceWorker.unregister();