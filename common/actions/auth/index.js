/**
 * Created by synerzip on 11/02/16.
 */
import { checkHttpStatus, parseJSON, clearAllDataFromLocalStorage } from '../../util';
import config from '../../config';
import {login,get} from '../common';
import storageMgr from '../../imagecache/storageMgr';

var React = require('react-native');
var {
  AsyncStorage
} = React;


export function handleFirstConnectivityChange() {
  return function(dispatch) {
      console.log('First change: ' + reach);
      switch (reach) {
        case 'wifi':
            config.NETWORK_STATUS = true;
          break;
        case 'cell':
          config.NETWORK_STATUS = true;
          break;
        case 'none':
          config.NETWORK_STATUS = false;
          break;
        case 'unknown':
          config.NETWORK_STATUS = false;
          break;
        default:
          config.NETWORK_STATUS = false;
      }

      dispatch ({
        type:'UPDATE_NETWORK_STATUS',
        payload:config.NETWORK_STATUS
      });
  }
}

export function removeLoginFail(react){


    return ({
        type:'REMOVE_LOGIN_FAILED'
    });
}

export function onTokenReceive(token){
    config.ACCESS_TOKEN = token;
    var isAuthenticated = (token) ? true : false;
    var payload = {'isAuthenticated': isAuthenticated, "checkedAuthentication": true}
    return ({
        type:'TOKEN_RECEIVED_FROM_STORAGE',
        payload: payload
    });
}

export function onUserRoleReceive(isManager){
    var payload = {"isManager": isManager, "checkedRole": true}
    return ({
        type:'USER_ROLE_RECEIVED_FROM_STORAGE',
        payload: payload
    });
}

export function loginUser(organizationId,userName, password) {
    return function (dispatch) {
        dispatch({type: 'LOGIN_USER_REQUEST'});
        var endpoint = "/oauth/token";
        var requestParams = encodeURI("client_id=mobile&client_secret=centric8&grant_type=password&username="+organizationId+"/"+userName+
            "&password=" + password);
        login(endpoint, requestParams).
            then((result)=> {
                console.log(result);
                AsyncStorage.setItem('ACCESS_TOKEN', result.access_token);
                AsyncStorage.setItem('REFRESH_TOKEN', result.refresh_token);
                AsyncStorage.setItem('ORGANIZATION_ID', organizationId);
                config.ACCESS_TOKEN = result.access_token;
                config.REFRESH_TOKEN = result.refresh_token;
                config.ORGANIZATION_ID = organizationId;
                // dispatch({type:'LOGIN_USER_SUCCESS'});
                dispatch(getProfileInfo());
            }).
            catch(error=> {
                console.log(error.status);
                if (error.status == 401){
                    dispatch({type: 'LOGIN_USER_FAILED',payload:{message:'Username and Password do not match'}});
                }else if(error.json){
                  console.log(error);
                    error.json().
                        then((result)=>{
                            if(error.status == 401 || (result.error_description === "Bad credentials")){
                                dispatch({type: 'LOGIN_USER_FAILED',payload:{message:'Username and Password do not match'}});
                            }
                            console.log(result);
                        })
                }else{
                    dispatch({type: 'LOGIN_USER_FAILED',payload:{message:'The Field Testing Server is down. Please try again or contact Administrator'}});
                }
            })

    }
}

export function logoutUser(){
    config.ACCESS_TOKEN = null;
    config.REFRESH_TOKEN = null;
    config.DEFAULT_FIELD_TEST= null;
    config.DEFAULT_SURVEY_FORM= null;
    config.USER_PROFILE= null;
    clearAllDataFromLocalStorage();
    AsyncStorage.clear().then((value) => {
    }).done();
    // storageMgr.clear();
    return ({
        type:'LOGOUT_USER'
    });
}

export function getProfileInfo(){
  return function (dispatch) {
    var endpoint =  "/api/v1/me";
    get(endpoint).
      then((result) =>  {
        AsyncStorage.setItem('USER_PROFILE', JSON.stringify(result));
        config.USER_PROFILE = result;
        if(validateFieldTestManager(result.roles)){
          console.log("Admin login");
          dispatch(onUserRoleReceive(true));
          dispatch(getDefaultFieldTest());
        }else{
          console.log("Tester login");
          dispatch(onUserRoleReceive(false));
          dispatch(getDefaultSurveyForm());
        }
      }).
      catch(error=> {
        console.log(error);
        // Reset login
        dispatch(logoutUser());
        dispatch({type: 'LOGIN_USER_FAILED',payload:{message:'Failed to login'}});
      })
  }
}

function validateFieldTestManager(roles){
  console.log("Roles: " + roles);
  for (var i = 0; i < roles.length; i++){
    var role = roles[i];
    if(role.name === "FieldTestManager" || role.name === "Admin"){
      AsyncStorage.setItem('USER_ROLE', "Manager");
      config.USER_ROLE_MANAGER = true;
      return true;
    }
  }
  AsyncStorage.setItem('USER_ROLE', "Tester");
  config.USER_ROLE_MANAGER = false;
  return false;
}

export function getDefaultFieldTest(){
  return function (dispatch) {
    var endpoint =  "/api/v1/fieldtests/default";
    get(endpoint).
      then((result) =>  {
        AsyncStorage.setItem('DEFAULT_FIELD_TEST', JSON.stringify(result));
        config.DEFAULT_FIELD_TEST = result;
        dispatch(getDefaultSurveyForm());
      }).
      catch(error=> {
        console.log(error);
        // Reset login
        dispatch(logoutUser());
        dispatch({type: 'LOGIN_USER_FAILED',payload:{message:'Failed to login'}});
      })
  }
}

export function getDefaultSurveyForm(){
  return function (dispatch) {
    var endpoint =  "/api/v1/survey-forms/default";
    get(endpoint).
      then((result) =>  {
        AsyncStorage.setItem('DEFAULT_SURVEY_FORM', JSON.stringify(result));
        config.DEFAULT_SURVEY_FORM = result;
        dispatch({type:'LOGIN_USER_SUCCESS'});
      }).
      catch(error=> {
        console.log(error);
        // Reset login
        dispatch(logoutUser());
        dispatch({type: 'LOGIN_USER_FAILED',payload:{message:'Failed to login'}});
      })
  }
}
