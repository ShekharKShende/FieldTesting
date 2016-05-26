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
    ActivityIndicatorIOS,
    StatusBarIOS,
    TextInput,
    Navigator,
    AlertIOS,
    Switch,
    TouchableOpacity
    } = React;

import config from 'common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as testerActionCreator from 'common/actions/tester';
import {Actions} from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var AppStyles = require('../styles.ios');
import * as testerCreator from 'common/actions/tester';
import dismissKeyboard from 'react-native-dismiss-keyboard';

class InviteTester extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    inviteTester() {
      dismissKeyboard();
      if(config.NETWORK_STATUS) {
        if(this.state.firstName && this.state.firstName.trim() != '' &&
            this.state.lastName && this.state.lastName.trim() != '' &&
            this.state.email && this.state.email.trim() != '' &&
            this.state.password && this.state.password.trim() != '') {
            this.props.testerActions.createTester(this.state.email, this.state.firstName, this.state.lastName, this.state.organization, this.state.password, this.state.phoneNumber);
        } else {
            AlertIOS.alert('All fields are compulsary');
        }
      } else {
          AlertIOS.alert('Not connected to Internet');
      }
    }
    componentWillUnmount(){
        dismissKeyboard();
    }

    onPasswordSubmit() {
        this.inviteTester();
    }

    onFirstNameSubmit() {
        this.refs.lastName.focus();
    }

    onLastNameSubmit() {
        this.refs.email.focus();
    }

    onEmailSubmit() {
        this.refs.password.focus();
    }

    onPhoneNumberSubmit() {
      //  this.refs.password.focus();
    }

    onLocationSubmit() {
        this.refs.password.focus();
    }

    onOrganizationIdSubmit() {
    }

    componentWillReceiveProps(nextProps) {
        this.props.testerActions.testerCreateRequestFinished();
        if (nextProps.testerCreated) {
          Actions.pop();
        }else if (nextProps.testerCreationError) {
          AlertIOS.alert(nextProps.testerCreationError);
        }
    }

    onPhoneNumberFocus(e){
        this.refs.scrollView.scrollToFocusedInput(e, React.findNodeHandle(this.refs.password), 44);
    }

    onLocationFocus(e){
        this.refs.scrollView.scrollToFocusedInput(e, React.findNodeHandle(this.refs.password), 44);
    }

    onPasswordFocus(e){
        this.refs.scrollView.scrollToFocusedInput(e, React.findNodeHandle(this.refs.organizationId), 44);
    }

    onOrganizationIdFocus(e){
        this.refs.scrollView.scrollToFocusedInput(e, React.findNodeHandle(this.refs.organizationId), 44);
    }

    onDismiss() {
      dismissKeyboard();
      Actions.pop();
    }

    render() {
        return (
            <View style={AppStyles.defaultContainer}>
              <View style={AppStyles.customNavBar}>
                    <View style={{flex: 0.3}}>
                        <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]}
                                          onPress={this.onDismiss.bind(this)}>
                            <View style={[AppStyles.navButtonContainer,{flex:1}]}>
                                <View style={AppStyles.navButtonLabelContainer} >
                                    <Text style={AppStyles.navBarButtonLabel}>Cancel</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={AppStyles.navBarTitleContainer}>
                        <Text style={AppStyles.navBarTitle}>NEW TESTER</Text>
                    </View>
                    <View style={{flex: 0.3}}>
                        <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]} onPress={this.inviteTester.bind(this)} ref ="donebutton">
                            <View style={[AppStyles.navButtonContainer,{paddingRight:10,flex:1,justifyContent:'flex-end'}]}>
                                <View style={AppStyles.navButtonLabelContainer}>
                                    <Text style={AppStyles.navBarButtonLabel}>Send</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height :1, backgroundColor : '#D8D8D6'}}></View>
                <KeyboardAwareScrollView ref="scrollView" style={styles.container} automaticallyAdjustContentInsets={false}>
                    <View style={styles.loginBox}>
                        <View style={{flex:1}}>
                                <TextInput
                                    style={[AppStyles.textFieldStyle, {marginTop: 10}]}
                                    ref="firstName"
                                    onChangeText={(firstName) => this.setState({firstName})}
                                    placeholder="First Name"
                                    placeholderTextColor="#CCCCCC"
                                    autoCorrect={false}
                                    clearButtonMode="always"
                                    value={this.state.firstName}
                                    returnKeyType="next"
                                    onSubmitEditing={this.onFirstNameSubmit.bind(this)}
                                    selectTextOnFocus
                                    enablesReturnKeyAutomatically
                                    keyboardAppearance="light"
                                    autoCapitalize="sentences"
                                    maxLength={250}
                                    />
                                <TextInput
                                    ref='lastName'
                                    style={[AppStyles.textFieldStyle, {marginTop: 2}]}
                                    onChangeText={(lastName) => this.setState({lastName})}
                                    placeholder="Last Name"
                                    placeholderTextColor="#CCCCCC"
                                    autoCorrect={false}
                                    clearButtonMode="always"
                                    value={this.state.lastName}
                                    returnKeyType="next"
                                    onSubmitEditing={this.onLastNameSubmit.bind(this)}
                                    selectTextOnFocus
                                    enablesReturnKeyAutomatically
                                    keyboardAppearance="light"
                                    autoCapitalize="sentences"
                                    maxLength={250}
                                    />
                                <TextInput
                                    ref='email'
                                    style={[AppStyles.textFieldStyle, {marginTop: 2}]}
                                    onChangeText={(email) => this.setState({email})}
                                    placeholder="Email"
                                    placeholderTextColor="#CCCCCC"
                                    autoCorrect={false}
                                    clearButtonMode="always"
                                    value={this.state.email}
                                    returnKeyType="next"
                                    onSubmitEditing={this.onEmailSubmit.bind(this)}
                                    selectTextOnFocus
                                    enablesReturnKeyAutomatically
                                    keyboardAppearance="light"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    maxLength={250}
                                    />

                                <TextInput
                                    ref='password'
                                    style={[AppStyles.textFieldStyle, {marginTop: 10}]}
                                    onChangeText={(password) => this.setState({password})}
                                    placeholder="Password"
                                    secureTextEntry
                                    placeholderTextColor="#CCCCCC"
                                    autoCorrect={false}
                                    clearButtonMode="always"
                                    value={this.state.password}
                                    editable={this.state.enablePassword}
                                    returnKeyType="default"
                                    onSubmitEditing={this.onPasswordSubmit.bind(this)}
                                    selectTextOnFocus
                                    enablesReturnKeyAutomatically
                                    keyboardAppearance="light"
                                    autoCapitalize="none"
                                    onFocus={this.onPasswordFocus.bind(this)}
                                    maxLength={250}
                                    />
                                <TextInput
                                    ref='organizationId'
                                    style={[AppStyles.textFieldStyle, {marginTop: 10,backgroundColor: '#f5f5f5'}]}
                                    onChangeText={(organizationId) => this.setState({organizationId})}
                                    placeholder={config.ORGANIZATION_ID}
                                    placeholderTextColor="#CCCCCC"
                                    editable={false}
                                    autoCorrect={false}
                                    clearButtonMode="always"
                                    value={this.state.organizationId}
                                    returnKeyType="default"
                                    onSubmitEditing={this.onOrganizationIdSubmit.bind(this)}
                                    selectTextOnFocus
                                    enablesReturnKeyAutomatically
                                    keyboardAppearance="light"
                                    autoCapitalize="none"
                                    onFocus={this.onOrganizationIdFocus.bind(this)}
                                    />
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
        backgroundColor: config.backgroundColor
    },
    loginBox: {
        flex: 1,
        margin: 24
    },

});

const mapStateToProps = (state) => ({
    "testerCreated": state.tester.testerCreated,
    "testerCreationError": state.tester.testerCreationError,
});

const mapDispatchToProps = (dispatch) => ({
    'testerActions': bindActionCreators(testerCreator, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteTester);
