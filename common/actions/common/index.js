/**
 * Created by synerzip on 17/02/16.
 */
import { checkHttpStatus, parseJSON } from '../../util';
import config from '../../config';
var React = require('react-native');
var {
  AsyncStorage
} = React;

export function login(nodeURL, data) {
    return fetch(config.BASE_URL + nodeURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': 'Basic bW9iaWxlOmNlbnRyaWM4'
        },
        body:data

    }).then(checkHttpStatus)
        .then((response) => {
            return parseJSON(response);
        })
        .then(result => {
            return result;
        })
        .catch(error => {
            throw error;
        })

}

export function renewAccessToken() {
    console.log("REFRESH_TOKEN: " + config.REFRESH_TOKEN);
      var endpoint = "/oauth/token?grant_type=refresh_token&refresh_token=" + config.REFRESH_TOKEN;
      return login(endpoint, null).
          then((result)=> {
              console.log(result);
              AsyncStorage.setItem('ACCESS_TOKEN', result.access_token);
              AsyncStorage.setItem('REFRESH_TOKEN', result.refresh_token);
              config.ACCESS_TOKEN = result.access_token;
              config.REFRESH_TOKEN = result.refresh_token;
              return result;
          }).
          catch(error=> {
            console.log(error);
            console.log(error.status);
            throw error;
          })
}

export function get(nodeURL) {
  console.log("nodeURLnodeURLnodeURLnodeURLnodeURL"+nodeURL);
    return fetch(config.BASE_URL + nodeURL, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config.ACCESS_TOKEN

        }
    }).then(checkHttpStatus)
        .then((response) => {
            return parseJSON(response);
        })
        .then(result => {
          console.log("result"+JSON.stringify(result));
            return result;
        })
        .catch(error => {
          console.log("NodeURLERROR"+error);
            throw error;
        })
}



export function post(nodeURL, data) {
    return fetch(config.BASE_URL + nodeURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + "84e631a5-5e42-48ff-9130-e83fbd7b6ccf"
        },
        body:JSON.stringify(data)

    }).then(checkHttpStatus)
        .then((response) => {
            return parseJSON(response);
        })
        .then(result => {
            return result;
        })
        .catch(error => {
            throw error;
        })

}

export function put(nodeURL, data) {
    return fetch(config.BASE_URL + nodeURL, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + "84e631a5-5e42-48ff-9130-e83fbd7b6ccf"
        },
        body: JSON.stringify(data)

    }).then(checkHttpStatus)
      .then((response) => {
          return parseJSON(response);
      })
      .then(result => {
          return result;
      })
      .catch(error => {
          throw error;
      })
}

export function del(nodeURL) {
    return fetch(config.BASE_URL + nodeURL, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + "84e631a5-5e42-48ff-9130-e83fbd7b6ccf"
        }
    }).then(checkHttpStatus)
        .then((response) => {
            return parseJSON(response);
        })
        .then(result => {
            return result;
        })
        .catch(error => {
            throw error;
        })
}
