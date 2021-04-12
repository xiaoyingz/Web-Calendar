import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import DailyView from "./components/daily-view-component";

class App extends Component {
    render() {
        return (
            <div>
                {/* <nav className='navbar navbar-expand navbar-dark bg-dark'>
                    <div className='navbar-nav mr-auto'>
                        <li className='nav-item'>
                            <Link to={'/book'} className='nav-link'>
                                BOOK
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to={'/author'} className='nav-link'>
                                AUTHOR
                            </Link>
                        </li>
                    </div>
                </nav> */}

                <div className='container mt-3'>
                    <Switch>
                        <Route exact path='/' component={DailyView} />
                        {/*<Route path='/daily/:date' component={DailyView} />*/}
                        {/*<Route exact path='/author' component={AuthorList} />*/}
                        {/*<Route exact path='/book/add' component={AddBook} />*/}
                        {/*<Route exact path='/author/add' component={AddAuthor} />*/}
                        {/*<Route exact path='/book/scrape' component={ScrapeBook} />*/}
                        {/*<Route exact path='/author/scrape' component={ScrapeAuthor} />*/}
                        {/*<Route path='/book/:id' component={Book} />*/}
                        {/*<Route path='/author/:id' component={Author} />*/}
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;
