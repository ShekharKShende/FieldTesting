/**
 * Created by synerzip on 09/02/16.
 */
import {createReducer} from '../util';

const fieldTestManagerMenu = [
	{
		id: 1,
		name: 'My Tests'
	},
	{
		id: 2,
		name: 'Samples'
	},
	{
		id: 3,
		name: 'Testers'
	},
	{
		id: 4,
		name: 'Sign Out'
	},
];
const fieldTesterMenu = [
	{
		id: 1,
		name: 'My Tests'
	},
	{
		id: 4,
		name: 'Sign Out'
	},
];

const initialState = {
    "id": null,
    "username": null,
    "name": null,
    "changePassword": null,
    "roles": null,
    "isAuthenticating": false,
    "isAuthenticated": false,
    "loginFail":false,
    "loginFailMessage":"",
    "checkedAuthentication":false,
    "checkedRole": false,
    "sideMenu":null
};

export default createReducer(initialState, {
    'LOGIN_USER_REQUEST': state => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            "loginFail":false,
            "loginFailMessage":""
        });
    },
    'LOGIN_USER_SUCCESS': state => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated':true
        });
    },
    'LOGIN_USER_FAILED': (state, payload) => {
        return Object.assign({}, state, {
            "loginFail":true,
            "loginFailMessage":payload.message
        });
    },
    'REMOVE_LOGIN_FAILED':(state, payload) => {
        return Object.assign({}, state, {
            "loginFail":false,
            "loginFailMessage":''
        });
    },
    'TOKEN_RECEIVED_FROM_STORAGE':(state, payload) => {
        return Object.assign({}, state, {
            "checkedAuthentication": payload.checkedAuthentication,
            "isAuthenticated": payload.isAuthenticated
        });
    },
    'USER_ROLE_RECEIVED_FROM_STORAGE':(state, payload) => {
        return Object.assign({}, state, {
            "checkedRole": payload.checkedRole,
            "sideMenu": payload.isManager ? fieldTestManagerMenu : fieldTesterMenu
        });
    },
    'LOGOUT_USER': state => {
        return Object.assign({}, state, {
            "id": null,
            "username": null,
            "name": null,
            "changePassword": null,
            "roles": null,
            "isAuthenticating": false,
            "isAuthenticated": false,
            "loginFail":false,
            "loginFailMessage":"",
            // "checkedAuthentication":false,
            "checkedRole": false,
            "sideMenu": null
        });
    }
});
