
import React, { Text, View, Component, PropTypes, StyleSheet, ListView, TouchableOpacity, Image } from 'react-native';
import Drawer from 'react-native-drawer';

import config from 'common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as authActionCreator from 'common/actions/auth';
import {Actions} from 'react-native-router-flux'
// App Globals
var AppStyles = require('./styles.ios');

/**
 * Custom Navbar Button component
 */
class NavbarButton extends React.Component{
    /**
     * On Icon Press
     */
    onPress() { if(this.props.onPress) this.props.onPress(); }

    render() {
        return (
            <TouchableOpacity onPress={this.onPress.bind(this)}>
                <Image
                    source={this.props.image}
                    style={this.props.style} />
            </TouchableOpacity>
        );
    }
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(NavbarButton);
