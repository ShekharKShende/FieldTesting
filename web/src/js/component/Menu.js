/**
 * Copyright (c) 2016-present, SYNERZIP SOFTECH PVT, LTD.
 * All rights reserved.
 *
 * Created by nikhila on 26/02/16.
 */

'use strict';

import React, {
    Component,
    View} from 'react';

import {Navbar, NavItem, Nav, NavDropdown, MenuItem} from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import * as appActionCreator from '../actions/routes';
import { connect } from 'react-redux';


class Menu extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    handleSelect(selectedKey) {
        if(selectedKey == '3'){
            //alert('Login');
            this.setState({selectedOption:selectedKey});
            this.props.appActions.showScreen('login');
        }
    }
    render() {
        let brandImg = (<img className='logo' src={this.props.logo} alt="" />);

        return (
            <Navbar inverse fixedTop fluid>
                <Navbar.Header>
                    <Navbar.Brand>
                        {brandImg}
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav pullRight activeKey={this.state.selectedOption} onSelect={this.handleSelect.bind(this)}>
                    <NavItem eventKey={1} href="#">Product</NavItem>
                    <NavItem eventKey={2} href="#">Contact</NavItem>
                    <NavItem eventKey={3} href="#">Login</NavItem>
                </Nav>
            </Navbar>
        );
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    appActions:bindActionCreators(appActionCreator,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);