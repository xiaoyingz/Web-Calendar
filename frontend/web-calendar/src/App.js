import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import DailyView from "./components/daily-view-component";
import EditTask from "./components/edit-task-component";

class App extends Component {
    render() {
        return (

                // <div>
                // <BrowserRouter>
                //     <div>
                //         <Navegacao />
                //         <Rotas />
                //     </div>
                // </BrowserRouter>
                // // </div>


                <div className="container mt-3">
                        <Switch>
                            <Route exact path='/' component={DailyView} />
                            <Route path='/task/:id' component={EditTask} />
                            {/*<Route exact path='/author' component={AuthorList} />*/}
                            {/*<Route exact path='/book/add' component={AddBook} />*/}
                            {/*<Route exact path='/author/add' component={AddAuthor} />*/}
                            {/*<Route exact path='/book/scrape' component={ScrapeBook} />*/}
                            {/*<Route exact path='/author/scrape' component={ScrapeAuthor} />*/}
                            {/*<Route path='/book/:id' component={Book} />*/}
                            {/*<Route path='/author/:id' component={Author} />*/}
                        </Switch>
                </div>
        );
    }
}

export default App;
// render(<App/>, document.getElementById("root"))