/**
 * Created by synerzip on 11/02/16.
 */
import { checkHttpStatus, parseJSON, clearAllDataFromLocalStorage } from '../../util';
import config from '../../config';
var React = require('react-native');
var {
  NetInfo,
} = React;


export function setNetworkConnectivityObserver() {
  return function(dispatch) {
    const handle = (isConnected) => dispatch(handleFirstConnectivityChange(isConnected));
    NetInfo.removeEventListener(
    'change',
    handle
    );

    NetInfo.addEventListener(
      'change',
      handle
    );
  }
}

export function handleFirstConnectivityChange(reach) {
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

export function initialNetworkStatusUpdate(status) {
  return function(dispatch) {
    dispatch ({
      type:'UPDATE_NETWORK_STATUS',
      payload:status
    });
  }
}
