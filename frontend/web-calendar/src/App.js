import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import DailyView from "./components/daily-view-component";
import EditTask from "./components/edit-task-component";
import EditSummary from "./components/edit-summary-component";

/**
 * Class to render the main page for this project.
 */
class App extends Component {
    render() {
        return (
                <div className="container mt-3">
                        <Switch>
                            <Route exact path='/' component={DailyView} />
                            <Route path='/task/:id' component={EditTask} />
                            <Route path='/summary/:id' component={EditSummary} />
                        </Switch>
                </div>
        );
    }
}

export default App;