/**
 * Created by synerzip on 09/02/16.
 */
import React, {
    Component,
    } from 'react-native';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
const store = configureStore();

import RouterConfigComponent from './RouterConfigComponent';

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <RouterConfigComponent />
            </Provider>
        );
    }
}