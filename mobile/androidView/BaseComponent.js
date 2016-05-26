'use strict';

import React, {
  BackAndroid,
  Component
} from 'react-native';
import {Actions} from 'react-native-router-flux'

class BaseComponent extends Component {
  componentDidMount() {
    this.androidBackHandler = this.onBackPressed.bind(this);
    BackAndroid.addEventListener('hardwareBackPress', this.androidBackHandler);
  }

  /*
  Pops out the current active component
  */
  onBackPressed() {
    Actions.pop();
    return true;
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.androidBackHandler);
  }
}
module.exports = BaseComponent;
