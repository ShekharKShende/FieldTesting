import {combineReducers} from 'redux';
import {routerStateReducer} from 'redux-router';

import auth from 'common/reducers/auth';
import app from 'common/reducers/app';

export default combineReducers({
    auth,
    app,
    router: routerStateReducer
});
