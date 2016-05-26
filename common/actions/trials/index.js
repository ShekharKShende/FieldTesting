import { checkHttpStatus, parseJSON, loadFromLocalStorage, saveToLocalStorage, getCommentFilePath} from '../../util';
import config from '../../config';
import {post,get,renewAccessToken} from '../common';
var { NativeModules } = require('react-native');
import fs from 'react-native-fs';
var underScore = require('underscore');
var commentToSync = 0;

export function selectTrial(trialRecord) {
  return function(dispatch) {
    dispatch({
      type: 'TRIAL_ROW_SELECTED',
      payload: trialRecord
    });
  }
}

function customizer(objValue, srcValue) {
  if (mergeLoad.isNull(objValue)) {
    return '';
  }
}

export function getTrials(status = "All", size = config.MAX_RECORD_IN_PAGE, page = config.MAX_LIMIT, sort = "startDate,desc") {
  console.log("instatus"+status);

  return function (dispatch) {
    // load
    dispatch({type: 'TRIAL_LIST_REQUEST'});
    var endpoint =  "/api/v1/trials?"+"status="+status+"&page="+page+"&size="+size+"&sort="+sort;
    get(endpoint).then((result) =>  {
      console.log("@@@@@@@@@@abc123"+JSON.stringify(result));
      saveToLocalStorage(config.LOCALTRIALLIST,result)
      dispatch({type:'TRIAL_LIST_REQUEST_RESPONSE',payload:{response:result}});
      //console.log("dispatched");
    }).catch(error=> {
      if(error.status == 401){
        // renewAccessToken().
        //     then((tokenResponse)=>{
        //         dispatch(getTrials(status,page,size,sort));
        //     }).catch(error=>{
        //         console.log("ERROR FROM TOKEN RENEW.....")
        //         dispatch({type: 'TRIAL_LIST_REQUEST_FAILED',payload:{message:'Fail to get Trial List'}});
        //     })
      }else {
         console.log(error);
         console.log(error.status);
         dispatch({type: 'TRIAL_LIST_REQUEST_FAILED',payload:{message:'Fail to get Trial List'}});
      }
    })
  }
}

// function getCommentFilePath(filename) {
//     fs.mkdir(fs.DocumentDirectoryPath+'/commentimages');
//     return fs.DocumentDirectoryPath+'/commentimages/'+filename;
// }



export function isSyncingRequired() {
    return function (dispatch) {
      loadFromLocalStorage(config.OFFLINECOMMENTLIST).then( commentList => {
        console.log('Trial List from local');
        console.log(commentList);
        if(commentList.length > 0) {
          dispatch({type: 'TRIAL_SYNC_REQUIRED',payload:true});
        }else {
          dispatch({type: 'TRIAL_SYNC_REQUIRED',payload:false});
        }
    }).catch(error => {
        console.log("Sync filter error : ");
        console.log(error);
        dispatch({type: 'TRIAL_SYNC_REQUIRED',payload:false});
    })
    }
  }

  export function syncCreateComments(feedback, trialId, feedbackList) {
    return function (dispatch) {
      //Web Call for Comment Sync
      var endpoint = "/api/v1/trials/" + trialId + "/feedbacks";
      var requestParams = {
        "comments": feedback.comments,
        "surveyFormId":config.DEFAULT_SURVEY_FORM.id,
      };

      post(endpoint, requestParams).
      then((result)=> {
        console.log("Comment result " + result.id)
        feedback.id = result.id
        feedback.isSync = false
        if(feedback.image != null) {
          console.log("With image upload");
          var filePath = getCommentFilePath(feedback.image);
          dispatch(uploadCommentImage(filePath, trialId, result, true, feedbackList));

        }else {
          console.log("Without image upload" + feedback.image);
          commentToSync--;
        }

        var feedbackIndex = feedbackList.indexOf(feedback);
        console.log("Count k of sync comment" + feedbackIndex);
        if(feedbackIndex != -1) {
          feedbackList.splice(feedbackIndex, 1);
          console.log(feedbackList);
        }

        if(commentToSync <= 0 && feedback.image == null) {
          console.log("Saving log");
          saveToLocalStorage(config.OFFLINECOMMENTLIST, feedbackList);
          dispatch({type: 'COMMENT_OFFLINE_SYNC_COMPLETED',payload:{message:"Comments syncing completed."}});
          dispatch(getTrials());
          dispatch(isSyncingRequired());
        }

      }).
      catch(error=> {
        console.log("Error:" + error);
        commentToSync--;
        if(commentToSync <= 0) {
          saveToLocalStorage(config.OFFLINECOMMENTLIST, feedbackList);
          dispatch({type: 'COMMENT_OFFLINE_SYNC_COMPLETED',payload:{message:"Comments syncing completed."}});
          dispatch(getTrials());
          dispatch(isSyncingRequired());
        }
      })
    }
  }

export function offlineCommentSyncing() {
  return function (dispatch) {
    if(config.NETWORK_STATUS == true) {
      dispatch({type: 'COMMENT_OFFLINE_SYNC_STARTED',payload:{message:"Syncing your comments with centric server."}});
      loadFromLocalStorage(config.OFFLINECOMMENTLIST).then( commentList => {
        console.log("trial object to sync.");
        console.log(commentList);

        if(commentList && commentList.length == 0) {
          dispatch({type: 'COMMENT_OFFLINE_SYNC_COMPLETED',payload:{message:"Comments syncing completed."}});
          dispatch(getTrials());
          dispatch(isSyncingRequired());
        }

        commentToSync = 0;
        for(var i = 0; i < commentList.length; i++) {
            var commentObject = commentList[i];
            commentToSync++;
            console.log("sync count" + commentToSync);
            dispatch(syncCreateComments(commentObject, commentObject.trialId, commentList));
        }
      }).catch(error=> {
        console.log("Error:" + error);
        commentToSync = 0;
        dispatch({type: 'COMMENT_OFFLINE_SYNC_FAILED',payload:{message:""}});
      })
    }else {
      console.log('Internet connection not available.');
    }
  }
}

export function createLocalCommentImage(fileName, imageUri, commentObject) {
    return function(dispatch) {
      var filePath = getCommentFilePath(fileName);
      console.log("Filepath " + filePath);
      var ret =  fs.downloadFile('file://'+imageUri, filePath).then((res)=>{
        //Add comment object into json and update into storage.
        dispatch({type:'COMMENT_CREATED',payload:{response:commentObject}});
        dispatch({type: 'TRIAL_SYNC_REQUIRED',payload:true});
      }).catch((error)=>{
          console.warn(error);
          console.log('error' + error);
          dispatch({type: 'COMMENT_CREATE_FAILED',payload:{message:"Failed to create comment"}});
      });
    }
}

export function saveCommentLocally(comment, trialId, imageUri, feedId) {
  return function(dispatch) {
      var commentObject = {
        comments:comment,
        isSync : true,
        creationDate: Date.now(),
        id: feedId,
        trialId: trialId,
        trial: {
          id: trialId
        },
        image: null
      }
      loadFromLocalStorage(config.OFFLINECOMMENTLIST).then( commentList => {
        console.log('commentList for offline mdoe.');
        console.log(commentList);
        commentObject.id = commentObject.id + '' + (commentList.length + 1)
        console.log(commentObject);
        if(imageUri != null) {
          var fileName = '' + commentObject.id + '.jpg';
          commentObject.image = fileName;
          commentList.push(commentObject);
          saveToLocalStorage(config.OFFLINECOMMENTLIST,commentList);
          dispatch(createLocalCommentImage(fileName, imageUri, commentObject));
        }else {
          commentList.push(commentObject);
          saveToLocalStorage(config.OFFLINECOMMENTLIST,commentList);
          dispatch({type:'COMMENT_CREATED',payload:{response:commentObject}});
          dispatch({type: 'TRIAL_SYNC_REQUIRED',payload:true});
        }
      }).catch(error => {
        commentObject.id = commentObject.id + '' + 1
        var commentList = [commentObject];

        if(imageUri != null) {
          var fileName = '' + commentObject.id + '.jpg';
          commentObject.image = fileName;
          saveToLocalStorage(config.OFFLINECOMMENTLIST,commentList);
          dispatch(createLocalCommentImage(fileName, imageUri, commentObject));
        }else {
          commentList.push(commentObject);
          saveToLocalStorage(config.OFFLINECOMMENTLIST,commentList);
          dispatch({type:'COMMENT_CREATED',payload:{response:commentObject}});
          dispatch({type: 'TRIAL_SYNC_REQUIRED',payload:true});
        }
        console.log('commentList for offline mdoe.');
        console.log(commentList);
        console.log(commentObject);


      })
  }
}

export function createComment(comment, trialId, imageUri) {
  return function (dispatch) {
    dispatch({type: 'CREATE_COMMENT_REQUEST'});
    if(config.NETWORK_STATUS == false) {
      loadFromLocalStorage(config.LOCALTRIALLIST).then( trialList => {
        console.log('Trial List from local .');
        console.log(trialList);
        var trialObjectList = underScore.where(trialList.content, {id: trialId});
        if(trialObjectList.length > 0) {

          var feedId = 1 + '' + trialId;
          if(trialObjectList[0].feedbacks) {
            feedId = (trialObjectList[0].feedbacks.length + 1) + '' + trialId;
          }

          if(imageUri == null) {
            dispatch(saveCommentLocally(comment, trialId, null, feedId));
          }else {
            dispatch(saveCommentLocally(comment, trialId, imageUri, feedId));
          }
        }else {
          dispatch({type: 'COMMENT_CREATE_FAILED',payload:{message:"Failed to create comment"}});
        }
      }).catch(error => {
            console.warn(error);
            dispatch({type: 'COMMENT_CREATE_FAILED',payload:{message:"Failed to create comment"}});
      });
    }else {
      var endpoint = "/api/v1/trials/" + trialId + "/feedbacks";
      // "fieldTesterId": config.DEFAULT_SURVEY_FORM.id,
      var requestParams = {
        "comments": comment,
        "surveyFormId":config.DEFAULT_SURVEY_FORM.id,
      };
      post(endpoint, requestParams).
      then((result)=> {
        console.log("Comment result " + result.id)
        if(imageUri != null) {
          var feedbackResponse = result;
          dispatch(uploadCommentImage(imageUri, trialId, result));
        }else {
          dispatch({type:'COMMENT_CREATED',payload:{response:result}});
        }
      }).
      catch(error=> {
        if(error.status == 401){
           renewAccessToken().
               then((tokenResponse)=>{
                   dispatch(createComment(comment, trialId, imageUri));
               }).catch(error=>{
                   console.log("ERROR FROM TOKEN RENEW.....1")
                   dispatch({type: 'COMMENT_CREATE_FAILED',payload:{message:"Failed to create comment"}});
               })
        }else {
          console.log(error);
          dispatch({type: 'COMMENT_CREATE_FAILED',payload:{message:"Failed to create comment"}});
        }
      })
    }
  }
}


export function selectUser(data) {
  console.log("selectUser TOKEN RENEW.....")
  return {
    type:'TESTER_SELECTED',
    payload:{data:data}
  }
}



export function uploadCommentImage(imageUri, trialId, result, isSync = false, feedbackList = []) {
  return function (dispatch) {
    var endpoint =  "/api/v1/trials/"+ trialId +"/feedbacks/"+ result.id +"/image";
    console.log("UploadComment image endpoint " + endpoint);
    console.log("Image url");
    console.log(imageUri);

    var obj = {
      uri: imageUri,
      uploadUrl : config.BASE_URL +endpoint,
      fileKey : 'file',
      mimeType : 'image/jpeg',
      fileName : 'comment_'+result.id+'.jpg',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
        'Authorization': 'Bearer ' + config.ACCESS_TOKEN
      }
    };
    //FileTransfer is native class written in objective C, available in ios xcode project
    NativeModules.FileTransfer.upload(obj, (err, res) => {
      console.log("Response is ");
      console.log(res);
      if(null == err && res.status == 200) {
        if(isSync == false) {
          dispatch({type:'COMMENT_CREATED',payload:{response:JSON.parse(res.data)}});
        }else {
          commentToSync--;
          fs.unlink(imageUri)
          .spread((success, path) => {
          console.log('FILE DELETED', success, path);
          })
          .catch((err) => {
            console.log(err.message);
          });

          if(commentToSync <= 0) {
            saveToLocalStorage(config.OFFLINECOMMENTLIST, feedbackList);
            dispatch({type: 'COMMENT_OFFLINE_SYNC_COMPLETED',payload:{message:"Comments syncing completed."}});
            dispatch(getTrials());
            dispatch(isSyncingRequired());
          }
        }

      } else {
        console.log(err);
        if(res.status == 500) {
          dispatch({type:'COMMENT_CREATED_WITHOUT_IMAGE',payload:{response:result}});
          dispatch({type: 'COMMENT_UPLOAD_IMAGE_FAILED',payload:{message:'Comments created Successfully, But Image upload failed'}});
        } else if(res.status == 401){
           renewAccessToken().
               then((tokenResponse)=>{
                   dispatch(uploadCommentImage(imageUri, trialId, result, isSync, feedbackList));
               }).catch(error=>{
                   console.log("ERROR FROM TOKEN RENEW.....2")
                   if(isSync == false) {
                     dispatch({type: 'COMMENT_UPLOAD_IMAGE_FAILED',payload:{message:'Fail to upload comment image'}});
                   }else {
                     commentToSync--;
                     if(commentToSync <= 0) {
                       saveToLocalStorage(config.OFFLINECOMMENTLIST, feedbackList);
                       dispatch({type: 'COMMENT_OFFLINE_SYNC_COMPLETED',payload:{message:"Comments syncing completed."}});
                       dispatch(getTrials());
                       dispatch(isSyncingRequired());
                     }
                   }

               })
        }else {
          if(isSync == false) {
            dispatch({type:'COMMENT_CREATED_WITHOUT_IMAGE',payload:{response:result}});
            dispatch({type: 'COMMENT_UPLOAD_IMAGE_FAILED',payload:{message:'Comments created Successfully, But Image upload failed'}});
          }else {
            commentToSync--;
            if(commentToSync <= 0) {
              saveToLocalStorage(config.OFFLINECOMMENTLIST, feedbackList);
              dispatch({type: 'COMMENT_OFFLINE_SYNC_COMPLETED',payload:{message:"Comments syncing completed."}});
              dispatch(getTrials());
              dispatch(isSyncingRequired());
            }
          }
        }
      }
    });
  }
}
