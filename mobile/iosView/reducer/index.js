import {combineReducers} from 'redux';

import auth from 'common/reducers/auth';
import app from 'common/reducers/app';
import sample from 'common/reducers/sample';
import drawer from './drawer';
import tester from 'common/reducers/tester';
import route from 'common/reducers/route';
import trial from 'common/reducers/trials';

export default combineReducers({
    auth,
    app,
    drawer,
    tester,
    route,
    sample,
    trial
});
