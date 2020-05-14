import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

//pages
import Login from './pages/Login';
import Monitore from './pages/Monitore';
import Configure from './pages/Configure';
import Info from './pages/Info';

class Routes extends Component {
    
    render () {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/' exact component={Login} />
                    <Route path='/monitore' component={Monitore} />
                    <Route path='/configure' component={Configure} />
                    <Route path='/info' component={Info}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes;