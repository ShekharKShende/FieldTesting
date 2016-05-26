/**
 * Created by nikhila on 02/24/2016.
 */
let React = require('react');
let { Router, Route, IndexRoute } = require('react-router');
import {App} from './js/containers';
import Home from './js/component/Home';
import Dashboard from './js/views/Dashboard';
import Login from './js/views/Login';

var Routes = (
    <Router>
        <Route path="/" component={Home}>
            <Route path="login" component={Login} />
            <Route path="dashboard" component={Dashboard} />
        </Route>
    </Router> );

export default Routes;