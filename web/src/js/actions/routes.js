/**
 * Created by synerzip on 29/02/16.
 */
import {pushState} from 'redux-router';

export function showScreen(route){
    return function(dispatch) {

        dispatch(pushState(null, "/"+route));
    }
}