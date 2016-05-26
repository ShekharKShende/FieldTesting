/**
 * Created by saurabhgangarde on 09/02/16.
 */
import {createReducer} from '../util';

const initialState = {
   //create sample request
    "id": null,
    "sampleCreatedRequestStarted": false,
    "sampleCreated": false,
    "sampleCreationError": "",
    "sampleResponse": "",
  //upload image request
    "sampleUploadImageFailed" : "",
 //get Sample List request
    "sampleListRequestStarted" : false,
    "sampleListRequestCompleted" : false,
    "sampleListRequestFailed":"",
    "sampleListRequestResponse":"",
    // set selected sample ID
    "sampleSelected": "",
    // checkout sample
    'sampleCheckoutRequestStarted' : false,
    'sampleCheckedOut': false,
    'sampleCheckedOutFromDetail': false,
    'sampleCheckoutError': "",

    // checkin sampleCheckedOut
    'sampleCheckinRequestStarted' : false,
    'sampleCheckedIn': false,
    'sampleCheckedInFromDetail': false,
    'sampleCheckinError': "",

    //get Sample detail history
     "sampleDetailHistoryRequest" : false,
     "sampleDetailHistorySuccessful":false,
     "sampleDetailHistoryRequestFailed":'',
     "sampleDetailHistoryRequestResponse":'',

    //select sample to pass sample detail screen
     "selectedSample":"",

    //edit samples
     "sampleEditStarted":false,
    //update sample
     "sampleUpdateRequest":false,
     "sampleUpdateCompleted":false,
     "sampleUpdateResponse":"",
     "sampleUpdateFailed":"",
    //delete Sample Request
     "sampleDeleteRequest":false,
     "sampleDeleteRequestResponse":"",
     "sampleDeleteRequestFailed":"",



};

export default createReducer(initialState, {
    'CREATE_SAMPLE_REQUEST': state => {
        return Object.assign({}, state, {
          'sampleUploadImageFailed':"",
           'sampleCreatedRequestStarted' : true,
           'sampleCreated': false,
        });
    },
    'SAMPLE_CREATED': (state, payload) => {

     state.sampleListRequestResponse.content.splice(0, 0, JSON.parse(payload.response.data));
        return Object.assign({}, state, {
            'sampleCreated': true,
            'sampleResponse': payload.response,
            'sampleListRequestResponse':state.sampleListRequestResponse
        });
    },
    'SAMPLE_CREATE_FAILED': (state, payload) => {
        return Object.assign({}, state, {
            "sampleCreated": false,
            "sampleCreationError": payload.message
        });
    },
    'SAMPLE_UPLOAD_IMAGE_FAILED': (state, payload) => {
            return Object.assign({}, state, {
                "sampleUploadImageFailed": payload.message
            });
    },
    'SAMPLE_LIST_REQUEST': state => {
        return Object.assign({}, state, {
            "sampleListRequestStarted": true,
        });
    },
    'SAMPLE_LIST_REQUEST_FAILED': (state, payload) => {
        return Object.assign({}, state, {
            "sampleListRequestStarted": false,
            "sampleListRequestFailed": payload.message,
        });
    },
     'SAMPLE_LIST_REQUEST_RESPONSE': (state, payload) => {
        return Object.assign({}, state, {
            "sampleCheckedIn":false,
            "sampleListRequestStarted": false,
            "sampleListRequestCompleted" : true,
            "sampleListRequestResponse": payload.response,
        });
    },
    'SET_SELECTED_SAMPLE_ID': (state, payload) => {
        return Object.assign({}, state, {
            "sampleSelected": payload,
        });
    },
    'CHECKOUT_SAMPLE_REQUEST': state => {
        return Object.assign({}, state, {
           'sampleCheckoutRequestStarted' : true,
            'sampleCheckedOut': false,
        });
    },
    'SAMPLE_CHECK_OUT_RESPONSE': (state, payload) => {
        state.selectedSample = payload.sample;
        return Object.assign({}, state, {
            'sampleCheckedOut': true,
            'sampleCheckedInFromDetail':false,
            'sampleCheckedOutFromDetail':true,
        });
    },
    'SAMPLE_CHECKED_OUT': state => {
        return Object.assign({}, state, {
            'sampleCheckedOut': false
        });
    },
    'SAMPLE_CHECKOUT_FAILED': (state, payload) => {
        return Object.assign({}, state, {
            "sampleCheckedOut": false,
            "sampleCheckoutError": payload.message
        });
    },
    'SAMPLE_CHECK_OUT_FINISHED': (state) => {
        return Object.assign({}, state, {
            'sampleCheckedOut': false,
            'sampleCheckedInFromDetail':false,
            "sampleCheckoutError": ""
        });
    },
    //sample detail history request
  'SAMPLE_DETAIL_HISTORY_REQUEST': state => {
       return Object.assign({}, state, {
           'sampleCheckedIn': false,
           "sampleDetailHistoryRequest": true,
           "sampleDetailHistorySuccessful" : false
       });
   },
   'SAMPLE_DETAIL_HISTORY_FAILED': (state, payload) => {
      return Object.assign({}, state, {
          "sampleDetailHistoryRequest": false,
          "sampleDetailHistorySuccessful" : false,
          "sampleDetailHistoryRequestFailed" : payload.message,
      });
  },
  'SAMPLE_DETAIL_HISTORY_RESPONSE': (state, payload) => {
     return Object.assign({}, state, {
         'sampleCheckedInFromDetail': false,
         'sampleCheckedOutFromDetail':false,
         "sampleDetailHistoryRequest": false,
         "sampleDetailHistorySuccessful" : true,
         "sampleDetailHistoryRequestResponse" : payload.response,
     });
  },
  'SAMPLE_DETAIL_FINISHED': (state) => {
      return Object.assign({}, state, {
          'sampleDetailHistoryRequestResponse': "",
          'selectedSample':""
      });
  },
  'SELECTED_SAMPLE': (state, payload) => {
      console.log("Selected Sample ::"+JSON.stringify(payload));
       return Object.assign({}, state, {
        "sampleUpdateCompleted":false,
        "selectedSample":payload,

       });
   },
   'CHECKIN_SAMPLE_REQUEST': state => {
        return Object.assign({}, state, {
           'sampleCheckinRequestStarted' : true,
            'sampleCheckedIn': false,
        });
    },
    'SAMPLE_CHECK_IN_RESPONSE': (state, payload)  => {
        state.selectedSample = payload.sample;
        return Object.assign({}, state, {
            'sampleCheckedIn': true,
            'sampleCheckedInFromDetail':true,
        });
    },
    'SAMPLE_CHECKED_IN': state => {
        return Object.assign({}, state, {
            'sampleCheckedIn': false
        });
    },
    'SAMPLE_CHECKIN_FAILED': (state, payload) => {
        return Object.assign({}, state, {
            "sampleCheckedIn": false,
            "sampleCheckInError": payload.message
        });
    },
    //edit samples
    'SAMPLE_EDIT_STARTED': state => {
        return Object.assign({}, state, {
            "sampleEditStarted":true,
        });
    },
    'SAMPLE_EDIT_FINISHED': state => {
        return Object.assign({}, state, {
            "sampleEditStarted":false,
            "sampleUpdateCompleted":false,
            "sampleCreated":false,
            "sampleCreatedRequestStarted":false,
            "sampleDeleteRequest":false,
            "sampleDeleteRequestResponse":"",
            "sampleDeleteRequestFailed":"",
        });
    },
    //update sample
    'SAMPLE_UPDATE_REQUEST': (state, payload) => {
        return Object.assign({}, state, {
            'sampleUploadImageFailed':"",
            "sampleUpdateRequest":true,
            "sampleUpdateCompleted": false,

        });
    },
    'SAMPLE_UPDATE_COMPLETED': (state, payload) => {
      for (var i = 0; i < state.sampleListRequestResponse.content.length; i++) {
         if(state.sampleListRequestResponse.content[i].id == payload.response.id) {
           state.sampleListRequestResponse.content[i] = payload.response;
           break;
         }
      }
        return Object.assign({}, state, {
            "sampleUpdateCompleted": true,
            "sampleUpdateResponse" : payload.response,
        });
    },
    'SAMPLE_UPDATE_FAILED': (state, payload) => {
        return Object.assign({}, state, {
            "sampleUpdateCompleted": true,
            "sampleUpdateFailed" : payload.message,

        });
    },
    'SAMPLE_DELETE_REQUEST': (state) => {
        return Object.assign({}, state, {
            "sampleDeleteRequest": true,
            "sampleDeleteRequestResponse" :"",
            "sampleDeleteRequestFailed":""

        });
    },
    'SAMPLE_DELETE_REQUEST_RESPOSNE': (state, payload) => {
      for (var i = 0; i < state.sampleListRequestResponse.content.length; i++) {
         if(state.sampleListRequestResponse.content[i].id == payload.response.id) {
           state.sampleListRequestResponse.content.splice(i, 1);
           break;
         }
      }
        return Object.assign({}, state, {
            "sampleDeleteRequestResponse" :payload.response,
            "sampleDeleteRequestFailed":"",
        });
    },
    'SAMPLE_DELETE_REQUEST_FAILED': (state, payload) => {
        return Object.assign({}, state, {
            "sampleDeleteRequestResponse" :"",
            "sampleDeleteRequestFailed":payload.message,
        });
    },

    'SAMPLE_DELETE_FINISHED': state => {
        return Object.assign({}, state, {
            "sampleDeleteRequest":false,
            "sampleDeleteRequestResponse":"",
            "sampleDeleteRequestFailed":"",
        });
    },


    'LOGOUT_USER': state => {
        return Object.assign({}, state, {
          //create sample request
           "id": null,
           "sampleCreatedRequestStarted": false,
           "sampleCreated": false,
           "sampleCreationError": "",
           "sampleResponse": "",
         //upload image request
           "sampleUploadImageFailed" : "",
        //get Sample List request
           "sampleListRequestStarted" : false,
           "sampleListRequestCompleted" : false,
           "sampleListRequestFailed":"",
           "sampleListRequestResponse":"",
           // set selected sample ID
           "sampleSelected": "",
           // checkout sample
           'sampleCheckoutRequestStarted' : false,
           'sampleCheckedOut': false,
           'sampleCheckedOutFromDetail': false,
           'sampleCheckoutError': "",

           // checkin sampleCheckedOut
           'sampleCheckinRequestStarted' : false,
           'sampleCheckedIn': false,
           'sampleCheckedInFromDetail': false,
           'sampleCheckinError': "",

           //get Sample detail history
            "sampleDetailHistoryRequest" : false,
            "sampleDetailHistorySuccessful":false,
            "sampleDetailHistoryRequestFailed":'',
            "sampleDetailHistoryRequestResponse":'',

           //select sample to pass sample detail screen
            "selectedSample":"",

           //edit samples
            "sampleEditStarted":false,
           //update sample
            "sampleUpdateRequest":false,
            "sampleUpdateCompleted":false,
            "sampleUpdateResponse":"",
            "sampleUpdateFailed":"",
            "sampleDeleteRequest":false,
            "sampleDeleteRequestResponse":"",
            "sampleDeleteRequestFailed":"",
        });
    },


});
