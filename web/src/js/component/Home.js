'use strict';

import React, {Component} from 'react';
import {RouteHandler} from 'react-router';
import {Grid, Row, Col, Jumbotron, Button} from 'react-bootstrap';
import Menu from './Menu';

export default class Home extends Component {
    render() {
        return (
            <div className="container">
                <Menu logo='img/logo.png'/>
                    <Jumbotron>
                        {this.props.children}
                    </Jumbotron>
            </div>
        );
    }
}