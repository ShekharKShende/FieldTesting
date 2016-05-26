/**
 * Created by saurabhgangarde on 09/02/16.
 */
import {createReducer} from '../util';

const initialState = {
   //create trial request
    "id": null,
    "commentCreatedRequestStarted": false,
    "commentCreated": false,
    "commentCreationError": "",
    "commentResponse": "",
    //upload image request
    "commentUploadImageFailed" : "",
    //get trial List request
    "trialListRequestStarted" : false,
    "trialListRequestCompleted" : false,
    "trialListRequestFailed":"",
    "trialListRequestResponse":"",
    "trialSelected":"",
    "isSyncRequired": false,

};

export default createReducer(initialState, {
  'COMMENT_UPLOAD_IMAGE_FAILED': (state, payload) => {
          return Object.assign({}, state, {
              "commentUploadImageFailed": payload.message
          });
    },
  'CREATE_COMMENT_REQUEST': state => {
      return Object.assign({}, state, {
         'commentCreatedRequestStarted' : true,
          'commentCreated': false,
      });
  },
  'COMMENT_CREATED': (state, payload) => {
       for (var i = 0; i < state.trialListRequestResponse.content.length; i++) {
          if(state.trialListRequestResponse.content[i].id == payload.response.trial.id) {
            state.trialListRequestResponse.content[i].feedbacks.push(payload.response);
            break;
          }
       }
      return Object.assign({}, state, {
          'commentCreated': true,
          'commentResponse': payload.response,
      });
  },

  'COMMENT_CREATED_WITHOUT_IMAGE': (state, payload) => {
       for (var i = 0; i < state.trialListRequestResponse.content.length; i++) {
          if(state.trialListRequestResponse.content[i].id == payload.response.trial.id) {
            state.trialListRequestResponse.content[i].feedbacks.push(payload.response);
            break;
          }
       }
      return Object.assign({}, state, {
      });
  },
  'COMMENT_CREATE_FAILED': (state, payload) => {
      return Object.assign({}, state, {
          "commentCreated": false,
          "commentCreationError": payload.message
      });
  },
  'TRIAL_LIST_REQUEST': state => {
      return Object.assign({}, state, {
          "trialListRequestStarted": true,
      });
  },
  'TRIAL_LIST_REQUEST_FAILED': (state, payload) => {
      return Object.assign({}, state, {
          "trialListRequestStarted": false,
          "trialListRequestFailed": payload.message,
      });
  },
   'TRIAL_LIST_REQUEST_RESPONSE': (state, payload) => {
     console.log("Res :::::::"+JSON.stringify(payload));
      return Object.assign({}, state, {
          "trialListRequestStarted": false,
          "trialListRequestCompleted" : true,
          "trialListRequestResponse": payload.response,
      });
  },
  'TRIAL_ROW_SELECTED':(state, payload) => {
    return Object.assign({}, state, {
      "trialSelected": payload
    });
  },
  'TRIAL_SYNC_REQUIRED':(state, payload) => {
    return Object.assign({}, state, {
      "isSyncRequired": payload
    });
  },
  'LOGOUT_USER': state => {
      return Object.assign({}, state, {
        //create trial request
         "id": null,
         "commentCreatedRequestStarted": false,
         "commentCreated": false,
         "commentCreationError": "",
         "commentResponse": "",
         //upload image request
         "commentUploadImageFailed" : "",
         //get trial List request
         "trialListRequestStarted" : false,
         "trialListRequestCompleted" : false,
         "trialListRequestFailed":"",
         "trialListRequestResponse":"",
         "trialSelected":"",
         "isSyncRequired": false

      });
  },

});
