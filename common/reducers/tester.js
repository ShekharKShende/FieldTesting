import {createReducer} from '../util';

const initialState = {
    "id": null,
    "testerListRequestStarted" : false,
    "testerListRequestCompleted" : false,
    "testerListRequestFailed":"",
    "testerListRequestResponse":"",
    "testerCreated": false,
    "testerCreationError": "",
    "testerResponse": "",
    "testerCreatedRequestStarted": false,
    "testerSelected": "",
    "testerDeleteRequest":false,
    "testerDeleteResponse":"",
    "testerDeleteFailed":"",
    "testerEditRequest":false,
    "testerEditResponse":"",
    "testerEditFailed":"",

};

export default createReducer(initialState, {
    'TESTER_LIST_REQUEST': state => {
        return Object.assign({}, state, {
            'testerListRequestStarted': true,
        });
    },
    'TESTER_LIST_REQUEST_RESPONSE': (state, payload) => {
        return Object.assign({}, state, {
            'testerListRequestStarted': false,
            'testerListRequestCompleted': true,
            'testerListRequestResponse':payload.response
        });
    },
    'TESTER_LIST_REQUEST_FAILED': (state, payload) => {
        return Object.assign({}, state, {
            "testerListRequestStarted": false,
            "testerListRequestFailed": payload.message
        });
    },
    'CREATE_TESTER_REQUEST': state => {
      return Object.assign({}, state, {
         'testerCreatedRequestStarted' : true,
         'testerCreated': false,
      });
    },
    'TESTER_CREATED': (state, payload) => {
      state.testerListRequestResponse.content.push(payload.response);
      return Object.assign({}, state, {
          'testerCreated': true,
          'testerResponse': payload.response,
          'testerListRequestResponse':state.testerListRequestResponse
      });
    },
    'TESTER_CREATE_FAILED': (state, payload) => {
        return Object.assign({}, state, {
            "testerCreated": false,
            "testerCreationError": payload.message
        });
    },
    'TESTER_CREATE_FINISHED': state => {
        return Object.assign({}, state, {
            "testerCreated": false,
            "testerCreationError": "",
            "testerResponse": "",
            "testerCreatedRequestStarted": false
        });
    },
    'TESTER_SELECTED': (state, payload) => {
        return Object.assign({}, state, {
            "testerSelected": payload.data,
        });
    },

    'RESET_TESTER_SELECTED': (state) => {
        return Object.assign({}, state, {
            "testerDeleteRequest": false,
            "testerSelected": "",
            "testerDeleteResponse":"",
            "testerDeleteFailed":"",
        });
    },
    'TESTER_DELETE_REQUEST': (state) => {
        return Object.assign({}, state, {
            "testerDeleteRequest": true,
        });
    },
    'TESTER_DELETE_RESPONSE': (state, payload) => {
      for (var i = 0; i < state.testerListRequestResponse.content.length; i++) {
         if(state.testerListRequestResponse.content[i].id == payload.response.id) {
           state.testerListRequestResponse.content.splice(i, 1);
           break;
         }
      }
        return Object.assign({}, state, {
            "testerListRequestFailed":"",
            "testerDeleteResponse": payload.response,
        });
    },
    'TESTER_DELETE_FAILED': (state, payload) => {
        return Object.assign({}, state, {
            "testerDeleteFailed": payload.message,
        });
    },
    'TESTER_EDIT_REQUEST': (state) => {
        return Object.assign({}, state, {
            "testerEditRequest": true,
        });
    },
    'TESTER_EDIT_RESPONSE': (state, payload) => {
        state.testerSelected = payload.response
        for (var i = 0; i < state.testerListRequestResponse.content.length; i++) {
           if(state.testerListRequestResponse.content[i].id == payload.response.id) {
             state.testerListRequestResponse.content[i] = payload.response;
             break;
           }
        }
        return Object.assign({}, state, {
            "testerEditFailed":"",
            "testerEditResponse": payload.response,
        });
    },
    'TESTER_EDIT_FAILED': (state, payload) => {
        return Object.assign({}, state, {
          "testerEditFailed":payload.message,
          "testerEditResponse": "",
        });
    },

    'LOGOUT_USER': state => {
        return Object.assign({}, state, {
          "id": null,
          "testerListRequestStarted" : false,
          "testerListRequestCompleted" : false,
          "testerListRequestFailed":"",
          "testerListRequestResponse":"",
          "testerCreated": false,
          "testerCreationError": "",
          "testerResponse": "",
          "testerCreatedRequestStarted": false,
          "testerSelected": "",
          "testerDeleteRequest":false,
          "testerDeleteResponse":"",
          "testerDeleteFailed":"",
          "testerEditRequest":false,
          "testerEditResponse":"",
          "testerEditFailed":"",
        });
    },


});
