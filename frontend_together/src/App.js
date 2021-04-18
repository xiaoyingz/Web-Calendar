import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddTask from "./components/addTask";
import MonthlyView from "./components/monthlyView";
import WeeklyView from "./components/weeklyView";
import DailyView from "./components/daily-view-component";
import EditTask from "./components/edit-task-component";
import EditSummary from "./components/edit-summary-component";

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/" className="navbar-brand">
            HOME
          </a>
          <div className="navbar-nav mr-auto">
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
              <Link to={"/"} className="nav-link">
                DailyView
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path="/addTask" component={AddTask} />
            <Route path="/monthlyView" component={MonthlyView} />
            <Route path="/weeklyView" component={WeeklyView} />
            <Route exact path='/' component={DailyView} />
            <Route path='/dailyView/:date' component={DailyView} />
            <Route path='/task/:id' component={EditTask} />
            <Route path='/summary/:id' component={EditSummary} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;