/**
 * Created by synerzip on 15/03/16.
 */
import {createReducer} from '../util';

const initialState = {
    'isRouteUpdated': false
};

export default createReducer(initialState, {
    'AFTER_ROUTER_ROUTE': state => {
        return Object.assign({}, state, {
            isRouteUpdated:!state.isRouteUpdated
        });
    },
    'AFTER_ROUTER_POP': state => {
        return Object.assign({}, state, {
            isRouteUpdated:!state.isRouteUpdated
        });
    }

});
