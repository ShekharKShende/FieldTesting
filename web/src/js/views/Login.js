/**
 * Created by synerzip on 29/02/16.
 */
'use strict';

import React, {
    Component,
    View} from 'react';

import reactMixin from 'react-mixin';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import {Grid, Row, Col, Input, ButtonInput} from 'react-bootstrap';
var LinkedStateMixin = require('react-addons-linked-state-mixin');
import * as authActionCreator from 'common/actions/auth';
import { bindActionCreators } from 'redux';
import * as appActionCreator from '../actions/routes';
import { connect } from 'react-redux';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.authActions.loginUser(this.state.username, this.state.password);
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.loginFail) {
            alert(nextProps.loginFailMessage);
            this.props.authActions.removeLoginFail();
            //this.refs.username.focus();
        }else if(nextProps.isAuthenticated){
            this.props.appActions.showScreen('dashboard');
        }
    }
    render(){
        return (
            <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={1000}
                                     transitionEnterTimeout={500}
                                     transitionLeaveTimeout={1000}>
                <div className="container cs-login">
                    <Grid>
                        <Row>
                            <Col xsHidden md={4}></Col>
                            <Col xs={12} md={4}>

                                <h2 style={{textAlign:'center'}}>
                                    <a href="#" title="Login screen">Login</a>
                                </h2>
                            </Col>
                            <Col xsHidden md={4}></Col>
                        </Row>
                        <Row>
                            <Col xsHidden md={4}></Col>
                            <Col xs={12} md={4}>
                                <form className="span7" onSubmit={this.handleSubmit.bind(this)}>
                                    <Input type="text" label="" placeholder="Enter Username"
                                           tabIndex="1"
                                           valueLink={this.linkState('username')}
                                           required autofocus />
                                    <Input type="password" label=""
                                           tabIndex="2" tabIndex="2" valueLink={this.linkState('password')}
                                           placeholder="Enter Password"
                                           required autofocus/>



                                    <ButtonInput type="submit"  bsStyle="success" bsSize="large" block>Sign In</ButtonInput>

                                    <p className="text-center">
                                        <a href="#/forgot-password" className="cs-login-forgot-password" tabIndex="4">Forgot Password</a>
                                    </p>
                                </form>
                            </Col>
                            <Col xsHidden md={4}></Col>
                        </Row>
                    </Grid>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}

reactMixin(Login.prototype,LinkedStateMixin);

const mapStateToProps = (state) => ({
    "loginFail": state.auth.loginFail,
    "loginFailMessage": state.auth.loginFailMessage,
    "isAuthenticated": state.auth.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
    authActions:bindActionCreators(authActionCreator,dispatch),
    appActions:bindActionCreators(appActionCreator,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);