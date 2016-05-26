/**
 * Created by synerzip on 27/02/16.
 */
var RNRF = require('react-native-router-flux');
var {Route, Schema,Scene,Router, Animations, Actions, TabBar} = RNRF;
import {createRouteReducer} from 'common/util';

const initialState = {
    currentRoute:null
};

export default createRouteReducer(initialState, {
    "AFTER_ROUTER_FOCUS":(state, payload) => {
        console.log(payload);
        return Object.assign({}, state, {
            'currentRoute': payload.name
        });
    }
});
