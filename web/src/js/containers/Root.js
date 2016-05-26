import React from 'react';
import {Provider} from 'react-redux';
import routes from '../../Routes';
import {ReduxRouter} from 'redux-router';

export default class Root extends React.Component {
    render () {
        return (
            <Provider store={this.props.store}>
                <div>
                    <ReduxRouter>
                        {routes}
                    </ReduxRouter>
                </div>
            </Provider>
        );
    }
}
