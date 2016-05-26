/**
 * Created by synerzip on 09/02/16.
 */
var React = require('react-native');
var {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    LayoutAnimation,
      TextInput,
    Navigator,
    Alert,
      Switch,
    TouchableOpacity
} = React;

import config from 'common/config';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as authActionCreator from 'common/actions/auth';
import {Actions} from 'react-native-router-flux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
var AppStyles = require('../styles.ios');
import dismissKeyboard from 'react-native-dismiss-keyboard';

class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enablePassword: false
        };
    }

    onLogin() {
        // if (config.NETWORK_STATUS) {
            if (this.state.username && this.state.username.trim() != '' &&
                this.state.password && this.state.password.trim() != '' &&
                this.state.organizationId && this.state.organizationId.trim() != '') {
                this.props.authActions.loginUser(this.state.organizationId, this.state.username, this.state.password);
            } else {
                Alert.alert( null, 'All fields are compulsary',null)
            }
        // } else {
        //     AlertIOS.alert('Internet connection failed');
        // }
    }

    onUserNameSubmit() {
        if (this.state.username && this.state.username.trim() != '') {
            this.setState({enablePassword: true});
            this.refs.password.focus();
        } else {
            this.setState({enablePassword: false});
        }
    }

    onPasswordFocus(e) {
        this.refs.scrollView.scrollToFocusedInput(e, React.findNodeHandle(this.refs.loginButton), 68);
    }

    onPasswordSubmit() {
        this.onLogin();
    }

    onOrganizationIdSubmit() {
        if (this.state.organizationId && this.state.organizationId.trim() != '') {
            this.refs.username.focus();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loginFail) {
            // AlertIOS.alert(nextProps.loginFailMessage);
            Alert.alert( null, nextProps.loginFailMessage,null)
            this.props.authActions.removeLoginFail();
            //this.refs.username.focus();
        } else if (nextProps.isAuthenticated) {
            Actions.Drawer();
        }
    }

    componentWillUnmount() {
        dismissKeyboard();
    }

    render() {
        var
            loginButton = <View ref="loginButton" style={styles.loginButtonBox}>
                <TouchableOpacity style={styles.loginButtonTouchBox} onPress={this.onLogin.bind(this)}>
                    <Text style={styles.loginButtonLabel}>LOG IN</Text>
                </TouchableOpacity>
            </View>;
        return (
            <View style={{flex:1,backgroundColor: '#f1f1ef'}}>

                <View style={AppStyles.customNavBar}>
                    <View style={{flex: 0.3}}>
                        <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]}>
                            <View style={[AppStyles.navButtonContainer,{flex:1}]}>
                                <View style={AppStyles.navButtonLabelContainer}>
                                    <Text style={AppStyles.navBarButtonLabel}></Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={AppStyles.navBarTitleContainer}>
                        <Text style={AppStyles.navBarTitle}>SIGN IN</Text>

                    </View>
                    <View style={{flex: 0.3}}>
                        <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]} ref="donebutton">
                            <View
                                style={[AppStyles.navButtonContainer,{paddingRight:10,flex:1,justifyContent:'flex-end'}]}>
                                <View style={AppStyles.navButtonLabelContainer}>
                                    <Text style={AppStyles.navBarButtonLabel}></Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardAwareScrollView ref="scrollView" style={styles.container}
                                         automaticallyAdjustContentInsets={false}>
                    <View style={styles.loginBox}>
                        <View style={{flex:1}}>
                            <View style={[AppStyles.imageHorizontalContainer]}>
                                <Image source={require('image!centric_logo_black')}/>
                            </View>
                            <TextInput
                                style={[AppStyles.textFieldStyle, {marginTop: 10}]}
                                ref="organizationId"
                                onChangeText={(organizationId) => this.setState({organizationId})}
                                placeholder="Organization ID"
                                placeholderTextColor="#CCCCCC"
                                autoCorrect={false}
                                clearButtonMode="always"
                                value={this.state.organizationId}
                                returnKeyType="next"
                                onEndEditing={this.onOrganizationIdSubmit.bind(this)}
                                selectTextOnFocus
                                enablesReturnKeyAutomatically
                                keyboardAppearance="light"
                                autoCapitalize="none"
                                maxLength={250}
                            />
                            <TextInput
                                style={[AppStyles.textFieldStyle, {marginTop: 10}]}
                                ref="username"
                                onChangeText={(username) => this.setState({username})}
                                placeholder="Email"
                                placeholderTextColor="#CCCCCC"
                                autoCorrect={false}
                                clearButtonMode="always"
                                value={this.state.username}
                                returnKeyType="next"
                                onEndEditing={this.onUserNameSubmit.bind(this)}
                                selectTextOnFocus
                                enablesReturnKeyAutomatically
                                keyboardAppearance="light"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                maxLength={250}
                            />
                            <TextInput
                                ref='password'
                                style={[AppStyles.textFieldStyle, {marginTop: 2}]}
                                onChangeText={(password) => this.setState({password})}
                                placeholder="Password"
                                secureTextEntry
                                placeholderTextColor="#CCCCCC"
                                autoCorrect={false}
                                clearButtonMode="always"
                                value={this.state.password}
                                editable={this.state.enablePassword}
                                returnKeyType="default"
                                onEndEditing={this.onPasswordSubmit.bind(this)}
                                selectTextOnFocus
                                enablesReturnKeyAutomatically
                                keyboardAppearance="light"
                                autoCapitalize="none"
                                onFocus={this.onPasswordFocus.bind(this)}
                                maxLength={250}
                            />

                        </View>

                        {loginButton}

                        <View style={[styles.bottomOptionBox,{marginTop:20}]}>
                            <TouchableOpacity>
                                <Text style={styles.footerLabel}>Field test app BETA 1.0</Text>
                            </TouchableOpacity>
                        </View>


                    </View>


                </KeyboardAwareScrollView>

            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: config.backgroundColor
    },
    bottomOptionBox: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    loginButtonBox: {
        height: 44,
        marginTop: 20,
        borderRadius: 3,
        backgroundColor: '#1f7ef6',
        justifyContent: 'center',
    },
    loginButtonTouchBox: {
        height: 44,
        padding: 7,
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
    },
    loginButtonLabel: {
        color: '#FFFFFF'
    },
    loginBox: {
        flex: 1,
        margin: 24
    },

    footerLabel: {
        color: '#ACADB0'
    },
});

const mapStateToProps = (state) => ({
    "loginFail": state.auth.loginFail,
    "loginFailMessage": state.auth.loginFailMessage,
    "isAuthenticated": state.auth.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
    'authActions': bindActionCreators(authActionCreator, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
