/**
 * Created by synerzip on 11/02/16.
 */
import {createConstants} from '../util';
export default createConstants(
    'SERVER_UNREACHABLE',
    'LOGIN_USER_REQUEST',
    'LOGIN_USER_FAILURE',
    'LOGIN_USER_SUCCESS',
    'LOGOUT_USER',
    'ACCESS_TOKEN',
    'REFRESH_TOKEN',
    'TOKEN_RECEIVED_FROM_STORAGE',
    'LOGOUT_USER',
    //create sample request
    'CREATE_SAMPLE_REQUEST',
    'SAMPLE_CREATED',
    'SAMPLE_CREATE_FAILED',
   //upload sample image request
    'SAMPLE_UPLOAD_IMAGE_STARTED',
    'SAMPLE_UPLOAD_IMAGE_FAILED',
    'SAMPLE_UPLOAD_IMAGE_UPLOADED',
  //get sample list request
    'SAMPLE_LIST_REQUEST',
    'SAMPLE_LIST_REQUEST_FAILED',
    'SAMPLE_LIST_REQUEST_RESPONSE',
  //get sample detail history
    'SAMPLE_DETAIL_HISTORY_REQUEST',
    'SAMPLE_DETAIL_HISTORY_FAILED',
    'SAMPLE_DETAIL_HISTORY_RESPONSE',
  //pass sample data
    'SELECTED_SAMPLE',
  //edit Sample
    'SAMPLE_EDIT_STARTED',
    'SAMPLE_EDIT_FINISHED',
  //update Sample
    'SAMPLE_UPDATE_REQUEST',
    'SAMPLE_UPDATE_RESPONSE',
    'SAMPLE_UPDATE_FAILED'
);
