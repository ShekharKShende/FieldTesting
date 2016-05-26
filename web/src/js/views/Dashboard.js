/**
 * Created by synerzip on 29/02/16.
 */
'use strict';

import React, {
    Component,
    View} from 'react';

import {Navbar, NavItem, Nav, NavDropdown, MenuItem} from 'react-bootstrap';

class Dashboard extends React.Component{
    render(){
        return (
            <div style={{margin:50,fontSize:30,color:'blue'}}>
                <h3>Dashboard</h3>
            </div>
        )
    }
}

export default Dashboard;