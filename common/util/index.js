/**
 * Created by synerzip on 09/02/16.
 */
import Storage from 'react-native-storage';
import { NetInfo } from 'react-native';
import config from '../config';
import fs from 'react-native-fs';

var localStorage = new Storage({
     // maximum capacity, default 1000
   size: 1000,

   // expire time, default 1 day(1000  3600  24 secs)
   defaultExpires: 1000 * 3600 * 24 * 365,

   // cache data in the memory. default is true.
   enableCache: true,

   // if data was not found in storage or expired,
   // the corresponding sync method will be invoked and return
   // the latest data.

 });

export function createConstants(...constants) {
    return constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}


export function createReducer(initialState, reducerMap) {
    return (state = initialState, action = {}) => {
        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}

export function createRouteReducer(initialState, reducerMap) {
    return (state = initialState, action = {}) => {
        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(state, action)
            : state;
    };
}

export function checkHttpStatus(response) {
  console.log("HTTP Status error");

    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        console.log("HTTP Status error ");
        console.log(response.status);
        throw response;
    }
}

export function parseJSON(response) {
    return response.json()
}

export function getCommentFilePath(filename) {
    fs.mkdir(fs.DocumentDirectoryPath+'/commentimages');
    return fs.DocumentDirectoryPath+'/commentimages/'+filename;
}

export function isFileExist(filePath) {
    fs.exists(filePath).then(isExist => {
      if(isExist){
        return true;
      }else {
        return false;
      }
    }).catch(error => {
      return false;
    })
}

export function loadFromLocalStorage(keyName) {
  return localStorage.load({
      key: keyName,

      // autoSync(default true) means if data not found or expired,
      // then invoke the corresponding sync method
      autoSync: true,

      // syncInBackground(default true) means if data expired,
      // return the outdated data first while invoke the sync method.
      // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
      syncInBackground: true
  }).then( trials => {
      // found data goes to then()
      return trials;
  }).catch( error => {
      // any exception including data not found
      // goes to catch()
      console.warn(error);
      throw error;

  })
}

export function saveToLocalStorage(keyName, data) {
  localStorage.save({
    key: keyName,   // Note: Do not use underscore("_") in key!
    rawData: data,
    // if not specified, the defaultExpires will be applied instead.
    // if set to null, then it will never expires.
    //365 days of expiration
    expires: null
  });
}

export function clearAllDataFromLocalStorage() {
  localStorage.remove({
    key: config.LOCALTRIALLIST
  });
  localStorage.clearMap();
}

export function getFormattedDate(date) {
    var startDate = new Date(date).toLocaleDateString();
    var startTime = new Date(date);
    var hours = ""+startTime.getHours();
    var min = ""+startTime.getMinutes();
    if(hours.length == 1) {
      hours ="0"+hours;
    }
    if(min.length == 1) {
      min ="0"+min;
    }
   return startDate + " "+hours+":"+min;
}
