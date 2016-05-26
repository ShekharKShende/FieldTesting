/**
 * Created by synerzip on 11/03/16.
 */
import {createReducer} from 'common/util';

const initialState = {
    "open": false
};

export default createReducer(initialState, {
    'TOGGLE_DRAWER': state => {
        var newState = !state.open;
        return Object.assign({}, state, {
            'open': newState
        });
    },
    'TOGGLE_DRAWER_STATE_UPDATE': (state, payload) => {
        var newState = payload.openState;
        return Object.assign({}, state, {
            'open': newState
        });
    }
});
