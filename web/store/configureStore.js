import rootReducer from '../reducer';
import thunk from 'redux-thunk';
import {applyMiddleware, compose, createStore} from 'redux';
import createLogger from 'redux-logger';
import routes from '../src/Routes';
import {reduxReactRouter} from 'redux-router';
import createHistory from 'history/lib/createHashHistory';

export default function configureStore(initialState) {
    let createStoreWithMiddleware;
    let history = createHistory({
        queryKey: false
    });
    const logger = createLogger();

    const middleware = applyMiddleware(thunk, logger);

    createStoreWithMiddleware = compose(
        middleware,
        reduxReactRouter({routes, history})
    );

    const store = createStoreWithMiddleware(createStore)(rootReducer, initialState);

    if (module.hot) {
        module.hot
            .accept('../reducer', () => {
                const nextRootReducer = require('../reducer/index');
                store.replaceReducer(nextRootReducer);
            });
    }

    return store;

}
