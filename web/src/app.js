/**
 * Created by nikhila on 02/24/2016.
 */
'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './js/containers/Root';
import configureStore from '../store/configureStore';

const target = document.getElementById('root');
const store = configureStore();

const node = (
    <Root store={store} />
);

ReactDOM.render(node, target);
