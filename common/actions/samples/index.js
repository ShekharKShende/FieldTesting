/**
* Created by saurabhgangarde on 11/02/16.
*/
import { checkHttpStatus, parseJSON } from '../../util';
import config from '../../config';
import {post,get,put,renewAccessToken,del} from '../common';
var { NativeModules } = require('react-native');
var imageURI = '';

export function createSample(description, name, styleId, sampleCode,imageUri) {
  return function (dispatch) {
    dispatch({type: 'CREATE_SAMPLE_REQUEST'});
    var endpoint = "/api/v1/samples";
    var requestParams = {
      "code":sampleCode,
      "description": description,
      "name": name,
      "styleId": styleId
    };
    post(endpoint, requestParams).
    then((result)=> {
      dispatch(uploadSampleImage(imageUri,result.id,false));
    }).
    catch(error=> {
      if(error.status == 401){
         renewAccessToken().
             then((tokenResponse)=>{
                 dispatch(createSample(description, name, styleId, sampleCode,imageUri));
             }).catch(error=>{
                 console.log("ERROR FROM TOKEN RENEW.....")
                 dispatch({type: 'SAMPLE_CREATE_FAILED',payload:{message:'Fail to create sample'}});
             })
      }else {
        dispatch({type: 'SAMPLE_CREATE_FAILED',payload:{message:'Fail to create sample'}});
      }
    })
  }
}

export function updateSample(description, name, styleId, sampleCode,imageUri,sampleId) {
  return function(dispatch) {
      dispatch({type: 'SAMPLE_UPDATE_REQUEST'});
      var endpoint = "/api/v1/samples/"+sampleId;
      var requestParams = {
        "code":sampleCode,
        "description": description,
        "name": name,
        "styleId": styleId
      };
      put(endpoint, requestParams).
      then((result)=> {
        if(imageUri != null && !imageUri.startsWith('http')) {
          dispatch(uploadSampleImage(imageUri,result.id,true));
        } else {
          dispatch({type:'SELECTED_SAMPLE',payload:result});
          dispatch({type:'SAMPLE_UPDATE_COMPLETED',payload:{response:result}});
        }
      }).
      catch(error=> {
        console.log(error);
        if(error.status == 401){
           renewAccessToken().
               then((tokenResponse)=>{
                   dispatch(updateSample(description, name, styleId, sampleCode,imageUri,sampleId));
               }).catch(error=>{
                   console.log("ERROR FROM TOKEN RENEW.....")
                   dispatch({type: 'SAMPLE_UPDATE_FAILED',payload:{message:'Fail to upadte sample'}});
               })
        }else {
          dispatch({type: 'SAMPLE_UPDATE_FAILED',payload:{message:'Fail to upadte sample'}});
        }
      })
  }
}



export function uploadSampleImage(imageUri, sampleId,isEditSample) {
  return function (dispatch) {
    var endpoint =  "/api/v1/samples/"+sampleId+"/image";
    var obj = {
      uri: imageUri,
      uploadUrl : config.BASE_URL +endpoint,
      fileKey : 'file',
      mimeType : 'image/jpeg',
      fileName : 'Sample_'+sampleId+'.jpg',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
        'Authorization': 'Bearer ' + config.ACCESS_TOKEN
      }
    };
    //FileTransfer is native class written in objective C, available in ios xcode project
    NativeModules.FileTransfer.upload(obj, (err, res) => {
      if(null == err && res.status == 200) {
        if(!isEditSample) {
          dispatch({type:'SAMPLE_CREATED',payload:{response:res}});
        } else {
          var updateSample = JSON.parse(res.data);
          dispatch({type:'SELECTED_SAMPLE',payload:updateSample});
          dispatch({type:'SAMPLE_UPDATE_COMPLETED',payload:{response:updateSample}});
        }
      } else {
        if(res.status == 500) {
          dispatch({type: 'SAMPLE_UPLOAD_IMAGE_FAILED',payload:{message:'Image size exceeded'}});
          dispatch(deleteSample(sampleId,false));
        } else if(res.status == 401){
           renewAccessToken().
               then((tokenResponse)=>{
                   dispatch(uploadSampleImage(imageUri, sampleId,isEditSample));
               }).catch(error=>{
                   console.log("ERROR FROM TOKEN RENEW.....")
                   if(!isEditSample) {
                     dispatch(deleteSample(sampleId,false));
                     dispatch({type: 'SAMPLE_UPLOAD_IMAGE_FAILED',payload:{message:'Fail to upload sample image while creating samples'}});
                   } else {
                     dispatch({type: 'SAMPLE_UPDATE_FAILED',payload:{message:'Fail to upload sample image while updating samples'}});
                   }
               })
        }else {
          if(!isEditSample) {
            dispatch(deleteSample(sampleId,false));
            dispatch({type: 'SAMPLE_UPLOAD_IMAGE_FAILED',payload:{message:'Fail to upload sample image while creating samples'}});
          } else {
            dispatch({type: 'SAMPLE_UPDATE_FAILED',payload:{message:'Fail to upload sample image while updating samples'}});
          }
        }
      }
    });
  }
}

export function deleteSample(sampleId, isBroadcastResposne) {
  return function (dispatch) {
    if(isBroadcastResposne) {
      dispatch({type: 'SAMPLE_DELETE_REQUEST'});
    }
    var endpoint =  "/api/v1/samples/"+sampleId;
    del(endpoint).
      then((result) =>  {
        if(isBroadcastResposne) {
          dispatch({type: 'SAMPLE_DELETE_REQUEST_RESPOSNE',payload:{response:result}});
        }
          console.log("Deleted Sample : Result :"+JSON.stringify(result));
      }).
      catch(error=> {
        console.log(error);
        if(error.status == 401){
           renewAccessToken().
               then((tokenResponse)=>{
                   dispatch(deleteSample(sampleId,isBroadcastResposne));
               }).catch(error=>{
                   console.log("ERROR FROM TOKEN RENEW.....")
               })
        }else {
          if(isBroadcastResposne) {
            dispatch({type: 'SAMPLE_DELETE_REQUEST_FAILED',payload:{message:"Can not delete the Sample, Sample has associated Test or Feedbacks"}});
          }
          console.log(error.status);
          console.log(error);
        }
      })
  }
}

export function getSamples(status,size,page,sort) {
  return function (dispatch) {
    dispatch({type: 'SAMPLE_LIST_REQUEST'});
    var endpoint =  "/api/v1/samples?"+"status="+status+"&size="+size+"&sort="+sort+"&page="+page;
    get(endpoint).
    then((result) =>  {
      dispatch({type:'SAMPLE_LIST_REQUEST_RESPONSE',payload:{response:result}});
    }).
    catch(error=> {
      if(error.status == 401){
         renewAccessToken().
             then((tokenResponse)=>{
                 dispatch(getSamples(status,size, page,sort));
             }).catch(error=>{
                 console.log("ERROR FROM TOKEN RENEW.....")
                 dispatch({type: 'SAMPLE_LIST_REQUEST_FAILED',payload:{message:'Fail to get Sample List'}});
             })
      }else {
         dispatch({type: 'SAMPLE_LIST_REQUEST_FAILED',payload:{message:'Fail to get Sample List'}});
      }
    })
  }
}

export function setSelectedSampleId(sampleId){
  return function (dispatch) {
    dispatch({type: "SET_SELECTED_SAMPLE_ID", payload:sampleId})
  }
}

export function checkoutSample(sampleId, fieldTestId, surveyFormId, testerId){
  return function (dispatch) {
    dispatch({type: 'CHECKOUT_SAMPLE_REQUEST'});
    var endpoint = "/api/v1/samples/" + sampleId + "/trials";
    var requestParams = {
      "description":"TRIAL",
      "fieldTestId": fieldTestId,
      "name": "TRIAL",
      "surveyFormId": surveyFormId,
      "testerId": testerId
    };
    post(endpoint, requestParams).
    then((result)=> {
      dispatch(getCheckedoutSample(sampleId,result));
      // dispatch({type:'SAMPLE_CHECK_OUT_RESPONSE',payload:result});
    }).
    catch(error=> {
      console.log(error);
      if(error.status == 401){
         renewAccessToken().
             then((tokenResponse)=>{
                 dispatch(checkoutSample(sampleId, fieldTestId, surveyFormId, testerId));
             }).catch(error=>{
                 console.log("ERROR FROM TOKEN RENEW.....")
                 dispatch({type: 'SAMPLE_CHECKOUT_FAILED',payload:{message:'Fail to checkout sample'}});
             })
      }else {
        dispatch({type: 'SAMPLE_CHECKOUT_FAILED',payload:{message:'Fail to checkout sample'}});
      }
    })
  }
}

export function getCheckedoutSample(sampleId,checkoutResponse) {
  return function (dispatch) {
    var endpoint =  "/api/v1/samples/"+sampleId;
    get(endpoint).
    then((result) =>  {
      checkoutResponse.sample = result;
      dispatch({type:'SAMPLE_CHECK_OUT_RESPONSE',payload:checkoutResponse});
    }).
    catch(error=> {
      if(error.status == 401){
        console.log(error);
         renewAccessToken().
             then((tokenResponse)=>{
                 dispatch(getSample(sampleId));
             }).catch(error=>{
                 console.log("ERROR FROM TOKEN RENEW.....")
                 dispatch({type: 'SAMPLE_CHECKOUT_FAILED',payload:{message:'Fail to checkout sample'}});
             })
      }else {
         dispatch({type: 'SAMPLE_CHECKOUT_FAILED',payload:{message:'Fail to checkout sample'}});
      }
    })
  }
}

export function sampleCheckedOut(){
  return function (dispatch) {
    dispatch({type: "SAMPLE_CHECKED_OUT"})
  }
}

export function checkinSample(sampleId, trialId){
  return function (dispatch) {
    dispatch({type: 'CHECKIN_SAMPLE_REQUEST'});
    var endpoint = "/api/v1/samples/" + sampleId + "/trials/" + trialId;
    var requestParams = {
      "fieldTestId": config.DEFAULT_FIELD_TEST.id,
      "status": "Completed",
      "surveyFormId": config.DEFAULT_SURVEY_FORM.id
    };
    put(endpoint, requestParams).
    then((result)=> {
      dispatch({type:'SAMPLE_CHECK_IN_RESPONSE',payload:result});
    }).
    catch(error=> {
      console.log(error);
      if(error.status == 401){
         renewAccessToken().
             then((tokenResponse)=>{
                 dispatch(checkinSample(sampleId, trialId));
             }).catch(error=>{
                 console.log("ERROR FROM TOKEN RENEW.....")
                 dispatch({type: 'SAMPLE_CHECKIN_FAILED',payload:{message:'Fail to checkin sample'}});
             })
      }else {
        dispatch({type: 'SAMPLE_CHECKIN_FAILED',payload:{message:'Fail to checkin sample'}});
      }
    })
  }
}

export function sampleCheckedIn(){
  return function (dispatch) {
    dispatch({type: "SAMPLE_CHECKED_IN"})
  }
}

export function getSamplesDetailHistory(page,size, sort,sampleId) {
  return function (dispatch) {
    dispatch({type: 'SAMPLE_DETAIL_HISTORY_REQUEST'});
    var endpoint =  "/api/v1/samples/"+sampleId+"/trials?page="+page+"&size="+size+"&sort="+sort;
    get(endpoint).
    then((result) =>  {
      dispatch({type:'SAMPLE_DETAIL_HISTORY_RESPONSE',payload:{response:result}});
    }).
    catch(error=> {
      if(error.status == 401){
         renewAccessToken().
             then((tokenResponse)=>{
                 dispatch(getSamplesDetailHistory(page,size, sort,sampleId));
             }).catch(error=>{
                 console.log("ERROR FROM TOKEN RENEW.....")
                 dispatch({type: 'SAMPLE_DETAIL_HISTORY_FAILED',payload:{message:'Failed to fetch sample detail history'}});
             })
      }else {
        dispatch({type: 'SAMPLE_DETAIL_HISTORY_FAILED',payload:{message:'Failed to fetch sample detail history'}});
      }
    })
  }
}

//action used to pass a data from one screen to another
export function onSelectSample(selectedSample) {
  return function (dispatch) {
    dispatch({type:'SELECTED_SAMPLE',payload:selectedSample});
  }
}

//action used to pass a data from one screen to another
export function onEditSample() {
  return function (dispatch) {
    dispatch({type:'SAMPLE_EDIT_STARTED'});
  }
}

export function onEditSampleFinished() {
  return function (dispatch) {
    dispatch({type:'SAMPLE_EDIT_FINISHED'});
  }
}


export function onSampleDeleteFinished() {
  return function (dispatch) {
    dispatch({type:'SAMPLE_DELETE_FINISHED'});
  }
}

export function onCheckoutSampleFinished() {
  return function (dispatch) {
    dispatch({type:'SAMPLE_CHECK_OUT_FINISHED'});
  }
}

export function onSampleDetailFinished() {
  return function (dispatch) {
    dispatch({type:'SAMPLE_DETAIL_FINISHED'});
  }
}
