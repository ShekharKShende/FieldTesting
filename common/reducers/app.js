/**
 * Created by synerzip on 13/02/16.
 */
import {createReducer} from '../util';

const initialState = {
    "isFetching": false,
    "loadingMessage": "",
    "isNetworkStatus": false
};

export default createReducer(initialState, {
    'LOGIN_USER_REQUEST': state => {
        return Object.assign({}, state, {
            'isFetching': true,
            'loadingMessage': 'Please Wait.'
        });
    },
    'LOGIN_USER_FAILED': state => {
        return Object.assign({}, state, {
            'isFetching': false,
            'loadingMessage': ''
        });
    },
    'LOGIN_USER_SUCCESS': state => {
        return Object.assign({}, state, {
            'isFetching': false,
            'loadingMessage': ''
        });
    },

    //creating sample
    'CREATE_SAMPLE_REQUEST': state => {
        return Object.assign({}, state, {
            'isFetching': true,
            'loadingMessage': 'Creating sample...'
        });
    },
    'SAMPLE_CREATE_FAILED': state => {
        return Object.assign({}, state, {
            'isFetching': false,
            'loadingMessage': ''
        });
    },
    'SAMPLE_UPLOAD_IMAGE_FAILED': state => {
        return Object.assign({}, state, {
            'isFetching': false,
            'loadingMessage': ''
        });
    },
    'SAMPLE_CREATED': state => {
        return Object.assign({}, state, {
            'isFetching': false,
            'loadingMessage': ''
        });
    },
    'SAMPLE_LIST_REQUEST': state => {
        return Object.assign({}, state, {
            'isFetching': true,
            'loadingMessage': 'Loading sample list'
        });
    },
    'SAMPLE_LIST_REQUEST_RESPONSE': state => {
        return Object.assign({}, state, {
            'isFetching': false,
            'loadingMessage': ''
        });
    },
    'SAMPLE_LIST_REQUEST_FAILED': state => {
        return Object.assign({}, state, {
            'isFetching': false,
            'loadingMessage': ''
        });
    },
    'CREATE_TESTER_REQUEST': state => {
        return Object.assign({}, state, {
            'isFetching': true,
            'loadingMessage': 'Creating tester'
        });
    },
    'TESTER_CREATED': state => {
        return Object.assign({}, state, {
            'isFetching': false,
            'loadingMessage': ''
        });
    },
    'TESTER_CREATE_FAILED': state => {
        return Object.assign({}, state, {
            'isFetching': false,
            'loadingMessage': ''
        });
    },
    'CHECKOUT_SAMPLE_REQUEST': state => {
        return Object.assign({}, state, {
          'isFetching': true,
          'loadingMessage': 'Check out sample'
        });
    },
    'SAMPLE_CHECKED_OUT': state => {
        return Object.assign({}, state, {
          'isFetching': false,
          'loadingMessage': ''
        });
    },
    'SAMPLE_CHECKOUT_FAILED': state => {
        return Object.assign({}, state, {
          'isFetching': false,
          'loadingMessage': ''
        });
    },
    // Trials and feedback
    'TRIAL_LIST_REQUEST':state => {
      console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      return Object.assign({}, state, {
          'isFetching': true,
          'loadingMessage': 'Loading My Tests'
      });
    },
    'TRIAL_LIST_REQUEST_FAILED':state => {
      console.log("-----------------------------------------------------------------------------------");
      return Object.assign({}, state, {
          'isFetching': false,
          'loadingMessage': ''
      });
    },
    'TRIAL_LIST_REQUEST_RESPONSE':state => {
      return Object.assign({}, state, {
          'isFetching': false,
          'loadingMessage': ''
      });
    },
    'CREATE_COMMENT_REQUEST':state => {
      return Object.assign({}, state, {
          'isFetching': true,
          'loadingMessage': 'Creating comment'
      });
    },
    'COMMENT_CREATE_FAILED':state => {
      return Object.assign({}, state, {
          'isFetching': false,
          'loadingMessage': ''
      });
    },
    'COMMENT_CREATED':state => {
      return Object.assign({}, state, {
          'isFetching': false,
          'loadingMessage': ''
      });
    },
    'COMMENT_UPLOAD_IMAGE_FAILED':state => {
      return Object.assign({}, state, {
          'isFetching': false,
          'loadingMessage': ''
      });
    },
    'SAMPLE_DETAIL_HISTORY_REQUEST': state => {
         return Object.assign({}, state, {
           'isFetching': true,
           'loadingMessage': 'Fetching Sample Detail'
         });
     },
     'SAMPLE_DETAIL_HISTORY_FAILED': (state, payload) => {
        return Object.assign({}, state, {
          'isFetching': false,
          'loadingMessage': ''
        });
    },
    'SAMPLE_DETAIL_HISTORY_RESPONSE': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''
       });
    },
    'CHECKIN_SAMPLE_REQUEST':state => {
     return Object.assign({}, state, {
         'isFetching': true,
         'loadingMessage': 'Checking in sample'
     });
   },
   'SAMPLE_CHECK_IN_RESPONSE': state => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''
       });
   },

   //update sample
   'SAMPLE_UPDATE_REQUEST': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': true,
         'loadingMessage': 'Updating sample'

       });
   },
   'SAMPLE_UPDATE_COMPLETED': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''

       });
   },
   'SAMPLE_UPDATE_FAILED': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''

       });
   },
   //Offline comment sync
   'COMMENT_OFFLINE_SYNC_STARTED': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': true,
         'loadingMessage': payload.message

       });
   },
   'COMMENT_OFFLINE_SYNC_COMPLETED': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''
       });
   },
   'COMMENT_OFFLINE_SYNC_FAILED': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''

       });
   },
   'UPDATE_NETWORK_STATUS': (state, payload) => {
      return Object.assign({}, state, {
        'isNetworkStatus': payload
      });
   },
   'TESTER_DELETE_REQUEST': (state) => {
       return Object.assign({}, state, {
         'isFetching': true,
         'loadingMessage': 'Deleting tester'
       });
   },
   'TESTER_DELETE_RESPONSE': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''
       });
   },
   'TESTER_DELETE_FAILED': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''
       });
   },
   'SAMPLE_DELETE_REQUEST': (state) => {
       return Object.assign({}, state, {
         'isFetching': true,
         'loadingMessage': 'Deleting sample'

       });
   },
   'SAMPLE_DELETE_REQUEST_RESPOSNE': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''
       });
   },
   'SAMPLE_DELETE_REQUEST_FAILED': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''
       });
   },
   'TESTER_LIST_REQUEST': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': true,
         'loadingMessage': ''
       });
   },
   'TESTER_LIST_REQUEST_RESPONSE': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''
       });
   },
   'TESTER_LIST_REQUEST_FAILED': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''
       });
   },
   'TESTER_EDIT_REQUEST': (state) => {
       return Object.assign({}, state, {
         'isFetching': true,
         'loadingMessage': ''
       });
   },
   'TESTER_EDIT_RESPONSE': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''
       });
   },
   'TESTER_EDIT_FAILED': (state, payload) => {
       return Object.assign({}, state, {
         'isFetching': false,
         'loadingMessage': ''
       });
   },

});
