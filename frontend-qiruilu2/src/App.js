import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddTask from "./components/addTask";
import Scheduler from "./components/overview";
import MonthlyView from "./components/monthlyView";
import WeeklyView from "./components/weeklyView";
import DailyView from "./components/dailyView";

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/" className="navbar-brand">
            ILLINOIS
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/scheduler"} className="nav-link">
                Scheduler
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/addTask"} className="nav-link">
                Add
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/monthlyView"} className="nav-link">
                MonthlyView
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/weeklyView"} className="nav-link">
                WeeklyView
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/dailyView"} className="nav-link">
                DailyView
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path="/addTask" component={AddTask} />
            <Route path="/scheduler" component={Scheduler} />
            <Route path="/monthlyView" component={MonthlyView} />
            <Route path="/weeklyView" component={WeeklyView} />
            <Route path="/dailyView" component={DailyView} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;