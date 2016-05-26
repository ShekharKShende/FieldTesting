import rootReducer from '../reducer';
import thunk from 'redux-thunk';
import {applyMiddleware, compose, createStore} from 'redux';
import createLogger from 'redux-logger';

export default function configureStore(initialState) {
    let createStoreWithMiddleware;

    const logger = createLogger();

    const middleware = applyMiddleware(thunk, logger);

    createStoreWithMiddleware = compose(
     middleware
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
