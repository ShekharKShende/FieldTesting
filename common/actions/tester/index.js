/**
 * Created by synerzip on 11/02/16.
 */
import { checkHttpStatus, parseJSON } from '../../util';
import {get, post,renewAccessToken,del,put} from '../common';

export function getTesters(page,size,sort) {
  return function (dispatch) {
    dispatch({type: 'TESTER_LIST_REQUEST'});
    var endpoint =  "/api/v1/testers?"+"page="+page+"&size="+size+"&sort="+sort;
    get(endpoint).
      then((result) =>  {
        dispatch({type:'TESTER_LIST_REQUEST_RESPONSE',payload:{response:result}});
      }).
      catch(error=> {
        if(error.status == 401){
           renewAccessToken().
               then((tokenResponse)=>{
                   dispatch(getTesters(page,size,sort));
               }).catch(error=>{
                   console.log("ERROR FROM TOKEN RENEW.....")
                   dispatch({type: 'TESTER_LIST_REQUEST_FAILED',payload:{message:'Fail to get Tester List'}});
               })
        }else {
          console.log(error.status);
          console.log(error);
          dispatch({type: 'TESTER_LIST_REQUEST_FAILED',payload:{message:'Fail to get Tester List'}});
        }
      })
  }
}

export function createTester(email, firstName, lastName, organization, password, phoneNumber) {
  return function (dispatch) {
    dispatch({type: 'CREATE_TESTER_REQUEST'});
    var endpoint = "/api/v1/signup-invites/";
    var requestParams = {
      "emailAddress": email,
      "firstName": firstName,
      "lastName": lastName,
      "phoneNumber": phoneNumber,
      "type": "FieldTester"
    };
    post(endpoint, requestParams).
    then((result)=> {
      dispatch(signupTester(email, firstName, lastName, organization, password, phoneNumber, result.code,result.id));
    }).
    catch(error=> {
      var errorJson = JSON.parse(error._bodyInit)
      console.log(errorJson);
      if(error.status == 401){
         renewAccessToken().
             then((tokenResponse)=>{
                 dispatch(createTester(email, firstName, lastName, organization, password, phoneNumber));
             }).catch(error=>{
                 console.log("ERROR FROM TOKEN RENEW.....")
                 dispatch({type: 'TESTER_CREATE_FAILED',payload:{message:'Failed to invite tester'}});
             })
      } else if(error.status == 409){
        dispatch({type: 'TESTER_CREATE_FAILED',payload:{message: errorJson.message}});
      } else if(errorJson.message.contains("Invalid Email Address")){
        dispatch({type: 'TESTER_CREATE_FAILED',payload:{message:'Invalid Email Address'}});
      }else {
        dispatch({type: 'TESTER_CREATE_FAILED',payload:{message:'Failed to invite tester'}});
      }
    })
  }
}

export function updateTester(testerID, emailAddress, enable, firstName,lastName, password,userName) {
  return function(dispatch) {
      dispatch({type: 'TESTER_EDIT_REQUEST'});
      var endpoint = "/api/v1/testers/"+testerID;
      var requestParams = {
        "emailAddress": emailAddress,
        "enabled":enable,
        "firstName": firstName,
        "lastName": lastName,
        "password": password,
        "userName": userName
      };
      put(endpoint, requestParams).
      then((result)=> {
        dispatch({type:'TESTER_EDIT_RESPONSE',payload:{response:result}});
      }).
      catch(error=> {
        console.log(error);
        if(error.status == 401){
           renewAccessToken().
               then((tokenResponse)=>{
                   dispatch(updateTester(testerID, emailAddress, enable, firstName,lastName));
               }).catch(error=>{
                   console.log("ERROR FROM TOKEN RENEW.....")
                   dispatch({type: 'TESTER_EDIT_FAILED',payload:{message:'Fail to upadte Tester'}});
               })
        }else {
          dispatch({type: 'TESTER_EDIT_FAILED',payload:{message:'Fail to upadte Tester'}});
        }
      })
  }
}

export function signupTester(email, firstName, lastName, organization, password, phoneNumber, inviteCode,id) {
  return function (dispatch) {
    dispatch({type: 'CREATE_TESTER_REQUEST'});
    var endpoint = "/api/v1/signup/";
    var requestParams = {
      "emailAddress": email,
      "firstName": firstName,
      "lastName": lastName,
      "password": password,
      "phoneNumber": phoneNumber,
      "inviteCode": inviteCode,
      "userName": email
    };
    post(endpoint, requestParams).
    then((result)=> {
      dispatch({type:'TESTER_CREATED',payload:{response:result}});
    }).
    catch(error=> {
      var errorJson = JSON.parse(error._bodyInit)
      console.log(errorJson);
      if(error.status == 401){
         renewAccessToken().
             then((tokenResponse)=>{
                 dispatch(signupTester(email, firstName, lastName, organization, password, phoneNumber, inviteCode));
             }).catch(error=>{
                 console.log("ERROR FROM TOKEN RENEW.....")
                 dispatch({type: 'TESTER_CREATE_FAILED',payload:{message:'Failed to invite tester'}});
             })
      } else if(error.status == 409 && errorJson.message.contains("Weak Password provided")){
        dispatch(deleteSignupInvite(id));
        dispatch({type: 'TESTER_CREATE_FAILED',payload:{message: 'Failed to invite tester, Weak Password provided'}});
      } else {
        dispatch(deleteSignupInvite(id));
        dispatch({type: 'TESTER_CREATE_FAILED',payload:{message:'Failed to invite tester'}});
      }
    })
  }
}


export function deleteSignupInvite(id) {
  return function (dispatch) {
    var endpoint =  "/api/v1/signup-invites/"+id;
    del(endpoint).
      then((result) =>  {
          console.log("Deleted Signup Invite : Result :"+JSON.stringify(result));
      }).
      catch(error=> {
        if(error.status == 401){
           renewAccessToken().
               then((tokenResponse)=>{
                   dispatch(deleteSignupInvite(id));
               }).catch(error=>{
                   console.log("ERROR FROM TOKEN RENEW.....")
               })
        }else {
          console.log(error.status);
          console.log(error);
        }
      })
  }
}



export function deleteTester(testerID) {
  return function (dispatch) {
      dispatch({type: 'TESTER_DELETE_REQUEST'});
    var endpoint =  "/api/v1/testers/"+testerID;
    del(endpoint).
      then((result) =>  {
          dispatch({type:'TESTER_DELETE_RESPONSE',payload:{response:result}});
      }).
      catch(error=> {

        if(error.status == 401){
           renewAccessToken().
               then((tokenResponse)=>{
                   dispatch(deleteTester(testerID));
               }).catch(error=>{
                   console.log("ERROR FROM TOKEN RENEW.....")
               })
        }else {
          //TODO : Need to check error response object
          // var errorJson = JSON.parse(error._bodyInit)
          // console.log(errorJson);
          // dispatch({type: 'TESTER_DELETE_FAILED',payload:{message: errorJson.message}});
          // console.log(error);
          dispatch({type: 'TESTER_DELETE_FAILED',payload:{message:"Could not Delete Tester"}});
        }
      })
  }
}


export function selectTester(data) {
  console.log("ERROR FROM TOKEN RENEW....."+data)
  return {
    type:'TESTER_SELECTED',
    payload:{data:data}
  }
}

export function resetSelecteTester() {
  return {
    type:'RESET_TESTER_SELECTED',
  }
}

export function testerCreateRequestFinished() {
  return {
    type:'TESTER_CREATE_FINISHED',
  }
}
